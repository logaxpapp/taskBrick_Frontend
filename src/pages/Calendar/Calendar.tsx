// File: src/components/calendar/CalendarWithEvents.tsx
import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '../../app/hooks/redux';

// RTK Query
import {
  useListEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} from '../../api/event/eventApi';
import { useListOrgMembersQuery } from '../../api/user/userApi';

// Types
import { EventModel } from '../../api/event/eventApi';
import { EventType } from '../../types/eventTypes';

// Generate a 6-row monthly matrix
function generateCalendarMatrix(year: number, month: number) {
  const startOfMonth = dayjs().year(year).month(month).startOf('month');
  const endOfMonth = dayjs().year(year).month(month).endOf('month');

  const startDayOfWeek = startOfMonth.day();
  const daysInMonth = endOfMonth.date();
  const days: Dayjs[] = [];

  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(startOfMonth.subtract(startDayOfWeek - i, 'day'));
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(dayjs().year(year).month(month).date(d));
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push(endOfMonth.add(i, 'day'));
  }

  const matrix: Dayjs[][] = [];
  for (let r = 0; r < 6; r++) {
    matrix.push(days.slice(r * 7, r * 7 + 7));
  }
  return matrix;
}

const CalendarWithEvents: React.FC = () => {
  // Redux
  const { user } = useAppSelector((state) => state.auth);
  const { selectedOrgId } = useAppSelector((state) => state.organization);

  // Current displayed month
  const [currentDate, setCurrentDate] = useState(dayjs());
  const calendarMatrix = generateCalendarMatrix(currentDate.year(), currentDate.month());

  // For date range
  const startOfMonthString = currentDate.startOf('month').format('YYYY-MM-DD');
  const endOfMonthString = currentDate.endOf('month').format('YYYY-MM-DD');

  // RTK Query calls
  const { data: events = [], isLoading } = useListEventsQuery(
    { orgId: selectedOrgId || '', start: startOfMonthString, end: endOfMonthString },
    { skip: !selectedOrgId }
  );
  const { data: orgMembers = [] } = useListOrgMembersQuery(
    { userId: user?._id || '', orgId: selectedOrgId || '' },
    { skip: !user?._id || !selectedOrgId }
  );

  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<EventType>(EventType.OTHER);
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState(dayjs().format('YYYY-MM-DDT08:00'));
  const [endTime, setEndTime] = useState(dayjs().format('YYYY-MM-DDT09:00'));
  const [participants, setParticipants] = useState<string[]>([]);

  // This will store the old participants, so we can figure out who is added/removed
  const [originalParticipants, setOriginalParticipants] = useState<string[]>([]);

  // Day click => create
  const handleDayClick = (day: Dayjs) => {
    if (!selectedOrgId) return;
    setEditMode(false);
    setEventId(null);
    setTitle('');
    setDescription('');
    setEventType(EventType.OTHER);
    setLocation('');
    setStartTime(day.startOf('day').format('YYYY-MM-DDT08:00'));
    setEndTime(day.startOf('day').format('YYYY-MM-DDT09:00'));
    setParticipants([]);
    setOriginalParticipants([]);
    setShowModal(true);
  };

  // Event click => edit
  const handleEventClick = (evt: EventModel) => {
    setEditMode(true);
    setEventId(evt._id);
    setTitle(evt.title);
    setDescription(evt.description || '');
    setEventType(evt.eventType);
    setLocation(evt.location || '');
    setStartTime(dayjs(evt.startTime).format('YYYY-MM-DDTHH:mm'));
    setEndTime(dayjs(evt.endTime).format('YYYY-MM-DDTHH:mm'));
    setParticipants(evt.participants);
    setOriginalParticipants(evt.participants);
    setShowModal(true);
  };

  // Checking if day is within event range
  function eventCoversDay(evt: EventModel, day: Dayjs) {
    const dayStart = day.startOf('day');
    const dayEnd = day.endOf('day');
    const evtStart = dayjs(evt.startTime);
    const evtEnd = dayjs(evt.endTime);
    return dayStart <= evtEnd && dayEnd >= evtStart;
  }

  async function handleSave() {
    if (!selectedOrgId || !title.trim()) {
      alert('Title is required');
      return;
    }

    // Figure out participantsToAdd and participantsToRemove
    const addSet = new Set(participants);
    const removeSet = new Set(originalParticipants);
    // if a user is new => in participants but not original
    const participantsToAdd = [...addSet].filter((id) => !removeSet.has(id));
    // if a user is missing => in original but not in new
    const participantsToRemove = [...removeSet].filter((id) => !addSet.has(id));

    const updates = {
      title: title.trim(),
      description: description.trim(),
      eventType,
      location: location.trim(),
      startTime: dayjs(startTime).toISOString(),
      endTime: dayjs(endTime).toISOString(),
      // add the participants changes
      participantsToAdd,
      participantsToRemove,
    };

    try {
      if (editMode && eventId) {
        await updateEvent({ id: eventId, updates }).unwrap();
      } else {
        // create
        await createEvent({
          orgId: selectedOrgId,
          title: updates.title,
          description: updates.description,
          eventType: updates.eventType,
          location: updates.location,
          startTime: updates.startTime,
          endTime: updates.endTime,
          participants, // in "create", we can pass the full final array
        }).unwrap();
      }
      setShowModal(false);
    } catch (err) {
      console.error('[Save Event Error]', err);
    }
  }

  async function handleDelete() {
    if (!eventId) return;
    if (!window.confirm('Delete event?')) return;
    try {
      await deleteEvent(eventId).unwrap();
      setShowModal(false);
    } catch (err) {
      console.error('[Delete Event Error]', err);
    }
  }

  function toggleParticipant(userId: string) {
    if (participants.includes(userId)) {
      setParticipants((prev) => prev.filter((id) => id !== userId));
    } else {
      setParticipants((prev) => [...prev, userId]);
    }
  }

  // Nav
  const handlePrevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));
  const handleNextMonth = () => setCurrentDate(currentDate.add(1, 'month'));
  const handleToday = () => setCurrentDate(dayjs());

  const isCurrentMonth = (day: Dayjs) => day.month() === currentDate.month();

  // Animation
  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = { hidden: { y: -50, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-200"
        >
          Prev
        </button>
        <h2 className="text-lg font-semibold">{currentDate.format('MMMM YYYY')}</h2>
        <div className="space-x-2">
          <button
            onClick={handleToday}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-200"
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>

      {/* DAYS OF WEEK */}
      <div className="grid grid-cols-7 text-center font-medium bg-white border-b border-gray-300">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((dow) => (
          <div key={dow} className="py-2 border-r last:border-none text-sm text-gray-600">
            {dow}
          </div>
        ))}
      </div>

      {/* CALENDAR MATRIX */}
      {calendarMatrix.map((week, wIndex) => (
        <div key={wIndex} className="grid grid-cols-7 text-sm">
          {week.map((day) => {
            const dayEvents = events.filter((evt) => eventCoversDay(evt, day));
            return (
              <div
                key={day.toString()}
                className={`relative h-24 p-1 border-b border-r last:border-r-0 bg-white
                            cursor-pointer flex flex-col
                            ${isCurrentMonth(day) ? '' : 'opacity-40'}`}
                onClick={() => handleDayClick(day)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{day.date()}</span>
                </div>
                {/* Show up to 2 events */}
                <ul className="mt-1 space-y-1 overflow-hidden">
                  {dayEvents.slice(0,2).map((evt) => (
                    <li
                      key={evt._id}
                      className="text-xs bg-purple-100 text-purple-700 rounded px-1 truncate"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(evt);
                      }}
                    >
                      {evt.title} 
                      {/* optionally show eventType e.g. [MEETING] */}
                      {evt.eventType !== 'other' && (
                        <span className="text-[10px] ml-1 text-gray-500">
                          [{evt.eventType}]
                        </span>
                      )}
                    </li>
                  ))}
                  {dayEvents.length > 2 && (
                    <li className="text-xs text-gray-500">
                      +{dayEvents.length - 2} more
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      ))}

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              className="fixed z-50 inset-0 flex items-center justify-center p-4"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div
                className="bg-white w-full max-w-md rounded shadow-lg p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-lg font-semibold mb-3">
                  {editMode ? 'Edit Event' : 'Create Event'}
                </h2>

                {/* Title */}
                <div className="mb-3">
                  <label className="block text-sm text-gray-700">Title</label>
                  <input
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm
                               focus:outline-none focus:ring-1 focus:ring-purple-400"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="block text-sm text-gray-700">Description</label>
                  <textarea
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm
                               focus:outline-none focus:ring-1 focus:ring-purple-400"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Event Type */}
                <div className="mb-3">
                  <label className="block text-sm text-gray-700">Event Type</label>
                  <select
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm
                               focus:outline-none focus:ring-1 focus:ring-purple-400"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                  >
                    {Object.values(EventType).map((et) => (
                      <option key={et} value={et}>{et}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="mb-3">
                  <label className="block text-sm text-gray-700">Location</label>
                  <input
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm
                               focus:outline-none focus:ring-1 focus:ring-purple-400"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                {/* StartTime / EndTime */}
                <div className="mb-3 flex space-x-2">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-700">Start Time</label>
                    <input
                      type="datetime-local"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm
                                 focus:outline-none focus:ring-1 focus:ring-purple-400"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-700">End Time</label>
                    <input
                      type="datetime-local"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm
                                 focus:outline-none focus:ring-1 focus:ring-purple-400"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>

                {/* Participants */}
                <div className="mb-3">
                  <label className="block text-sm text-gray-700">Participants</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {orgMembers.map((member) => {
                      const name = `${member.firstName || ''} ${member.lastName || ''}`.trim() || member.email;
                      const selected = participants.includes(member._id);
                      return (
                        <button
                          key={member._id}
                          type="button"
                          onClick={() => toggleParticipant(member._id)}
                          className={`
                            px-2 py-1 rounded border text-xs 
                            ${selected ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border-gray-300'}
                          `}
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end space-x-2">
                  {editMode && (
                    <button
                      className="px-4 py-1 text-sm rounded border border-red-300 text-red-700 hover:bg-red-100"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  )}
                  <button
                    className="px-4 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-1 text-sm rounded bg-purple-600 text-white hover:bg-purple-700"
                    onClick={handleSave}
                  >
                    {editMode ? 'Update' : 'Save'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarWithEvents;
