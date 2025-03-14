// File: src/components/chat/ChatSidebar.tsx
import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import {
  MdChatBubbleOutline,
  MdPeopleOutline,
  MdContactMail,
  MdGroupWork,
  MdGroups // We'll use an icon for the participant popover toggle
} from 'react-icons/md';

import { useAppSelector } from '../../app/hooks/redux';
import {
  useListUserConversationsQuery,
  useCreateConversationMutation,
} from '../../api/conversation/conversationApi';
import { useListOrgMembersQuery } from '../../api/user/userApi';
import { useListTeamsQuery } from '../../api/team/teamApi';
import { useListAllOrgUsersQuery } from '../../api/organization/organizationApi';
import TeamMembersList from './TeamMembersList';
import { joinConversation } from '../../socket/socketClient';

interface ChatSidebarProps {
  onSelectConversation: (id: string) => void;
  activeConversationId: string | null;
  isCollapsed: boolean; // if sidebar is collapsed
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  onSelectConversation,
  activeConversationId,
  isCollapsed,
}) => {
  // Tabs
  const [activeTab, setActiveTab] = useState<'chat' | 'members' | 'contact' | 'teams'>('chat');
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

  // Track which conversation's participant list is currently shown
  const [expandedParticipantsConvId, setExpandedParticipantsConvId] = useState<string | null>(null);

  // Redux: current user & org
  const { user } = useAppSelector((state) => state.auth);
  const { selectedOrgId } = useAppSelector((state) => state.organization);

  // (1) Query: conversations
  const {
    data: conversations,
    isLoading: convoLoading,
    isError: convoError,
  } = useListUserConversationsQuery(
    { orgId: selectedOrgId || '', userId: user?._id || '' },
    { skip: !selectedOrgId || !user?._id }
  );

  // (2) Query: org members
  const {
    data: orgMembers,
    isLoading: membersLoading,
    isError: membersError,
  } = useListOrgMembersQuery(
    { userId: user?._id || '', orgId: selectedOrgId || '' },
    { skip: !user?._id || !selectedOrgId }
  );

  // (3) Query: teams
  const {
    data: teams,
    isLoading: teamsLoading,
    isError: teamsError,
  } = useListTeamsQuery(selectedOrgId || '', { skip: !selectedOrgId });

  // (4) Query: all org users (contacts + invites)
  const {
    data: allOrgUsersData,
    isLoading: allOrgLoading,
    isError: allOrgError,
  } = useListAllOrgUsersQuery(selectedOrgId || '', { skip: !selectedOrgId });

  // (5) Mutation: create conversation
  const [createConversation] = useCreateConversationMutation();

  /** Toggle expanded Team  */
  const handleExpandTeam = (teamId: string) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
  };

  /** Join a convo */
  const handleSelectConversation = (conversationId: string) => {
    joinConversation(conversationId);
    onSelectConversation(conversationId);
  };

  /** 1-on-1 with user */
  const handleChatWithUser = async (otherUserId: string) => {
    if (!user?._id || !selectedOrgId) return;
    try {
      const payload = {
        orgId: selectedOrgId,
        participants: [user._id, otherUserId],
      };
      const newConv = await createConversation(payload).unwrap();
      joinConversation(newConv._id);
      onSelectConversation(newConv._id);
    } catch (err) {
      console.error('Error creating 1-on-1 chat:', err);
    }
  };

  /** Team chat */
  const createTeamChat = async (teamId: string) => {
    if (!selectedOrgId || !user?._id) return;
    try {
      // In reality, fetch actual userIds from team or userTeam
      const userIdsInTeam: string[] = [user._id];
      const payload = {
        orgId: selectedOrgId,
        participants: userIdsInTeam,
      };
      const newConv = await createConversation(payload).unwrap();
      joinConversation(newConv._id);
      onSelectConversation(newConv._id);
    } catch (err) {
      console.error('Error creating team chat:', err);
    }
  };

  /** 
   * If the sidebar is collapsed 
   * => Only show icons 
   */
  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center overflow-y-auto border-r border-gray-200 w-16">
        <div className="mt-4 space-y-4">
          <button
            onClick={() => setActiveTab('chat')}
            className={`p-2 rounded-full ${
              activeTab === 'chat' ? 'bg-purple-600 text-white' : 'text-gray-500'
            }`}
            title="Chat"
          >
            <MdChatBubbleOutline size={20} />
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`p-2 rounded-full ${
              activeTab === 'members' ? 'bg-purple-600 text-white' : 'text-gray-500'
            }`}
            title="Members"
          >
            <MdPeopleOutline size={20} />
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`p-2 rounded-full ${
              activeTab === 'contact' ? 'bg-purple-600 text-white' : 'text-gray-500'
            }`}
            title="Contact"
          >
            <MdContactMail size={20} />
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`p-2 rounded-full ${
              activeTab === 'teams' ? 'bg-purple-600 text-white' : 'text-gray-500'
            }`}
            title="Teams"
          >
            <MdGroupWork size={20} />
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center px-2">
          {activeTab.toUpperCase()}
        </div>
      </div>
    );
  }

  /**
   * Expanded sidebar 
   */
  return (
    <div className="w-72 flex flex-col border-r border-gray-200 min-h-screen overflow-y-auto">
      {/* SEARCH BAR */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <FiSearch className="absolute left-2 top-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded focus:outline-none
                       focus:ring-1 focus:ring-purple-400 text-sm"
          />
        </div>
      </div>

      {/* TABS */}
      <div className="px-4 flex mb-2 border-b border-gray-200 text-xs items-start space-x-2">
        <button
          onClick={() => setActiveTab('chat')}
          className={`text-xs px-3 py-1 rounded ${
            activeTab === 'chat' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`text-xs px-3 py-1 rounded ${
            activeTab === 'members'
              ? 'bg-purple-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Members
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`text-xs px-3 py-1 rounded ${
            activeTab === 'contact'
              ? 'bg-purple-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Contact
        </button>
        <button
          onClick={() => setActiveTab('teams')}
          className={`text-xs px-3 py-1 rounded ${
            activeTab === 'teams' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Teams
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="flex-1 overflow-y-auto">
        {/* 1) CHAT TAB => list existing convos */}
        {activeTab === 'chat' && (
          <div>
            {convoLoading && <p className="p-4 text-gray-500">Loading conversations...</p>}
            {convoError && <p className="p-4 text-red-500">Error loading conversations</p>}

            {conversations && conversations.length > 0 ? (
              <ul className="space-y-1">
                {conversations.map((conv) => {
                  // For a populated conversation, conv.participants might be an array of user objects
                  // We'll figure out the "main" display name:
                  const participantCount = conv.participants.length;
                  let displayName = 'Conversation';
                  if (participantCount === 2) {
                    // find the "other" user
                    // because one participant is me
                    const other = conv.participants.find((p: any) => p._id !== user?._id);
                    if (other) {
                      displayName = `${other.firstName || ''} ${other.lastName || ''}`.trim() || other.email;
                    }
                  } else if (participantCount > 2) {
                    // group chat
                    displayName = `Group Chat (${participantCount} participants)`;
                  }

                  const isActive = activeConversationId === conv._id;
                  const isExpanded = expandedParticipantsConvId === conv._id;
                  
                  return (
                    <li
                      key={conv._id}
                      className={`px-4 py-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 ${
                        isActive ? 'bg-purple-50' : ''
                      }`}
                      onClick={() => handleSelectConversation(conv._id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800 truncate">
                          {displayName}
                        </span>

                        {/* If multiple participants, show an icon to see them all */}
                        {participantCount > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation(); // don't trigger select conversation
                              setExpandedParticipantsConvId(
                                isExpanded ? null : conv._id
                              );
                            }}
                            className="text-gray-400 hover:text-gray-600 ml-3"
                            title="Show all participants"
                          >
                            <MdGroups size={18} />
                          </button>
                        )}
                      </div>

                      {/* If expanded, show the participant list */}
                      {isExpanded && (
                        <div className="mt-2 bg-white border rounded p-2 shadow-sm text-xs">
                          {conv.participants.map((p: any) => (
                            <div key={p._id} className="py-1 border-b last:border-0">
                              {(p.firstName || p.lastName)
                                ? `${p.firstName || ''} ${p.lastName || ''}`
                                : p.email}
                            </div>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              !convoLoading &&
              !convoError && <div className="p-4 text-gray-500">No conversations found.</div>
            )}
          </div>
        )}

        {/* 2) MEMBERS TAB => "orgMembers" from userApi */}
        {activeTab === 'members' && (
          <div className="p-4 text-sm text-gray-600">
            {membersLoading && <div>Loading organization members...</div>}
            {membersError && <div>Failed to load members.</div>}

            {orgMembers && orgMembers.length > 0 ? (
              <ul>
                {orgMembers.map((member) => (
                  <li key={member._id} className="py-2 border-b border-gray-100">
                    <div className="font-semibold">
                      {member.firstName} {member.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{member.email}</div>

                    <button
                      className="mt-1 text-xs text-blue-600 hover:underline"
                      onClick={() => handleChatWithUser(member._id)}
                    >
                      Chat with user
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              !membersLoading &&
              !membersError && <div>No members found for this organization.</div>
            )}
          </div>
        )}

        {/* 3) CONTACT TAB => "allOrgUsersData" from organizationApi (incl. invites) */}
        {activeTab === 'contact' && (
          <div className="p-4 text-sm text-gray-600">
            {allOrgLoading && <div>Loading contacts (all org users + invites)...</div>}
            {allOrgError && <div>Failed to load contacts.</div>}

            {allOrgUsersData && (
              <>
                <h4 className="font-semibold mb-2">Actual Users</h4>
                {allOrgUsersData.users.length > 0 ? (
                  <ul>
                    {allOrgUsersData.users.map((u: any) => (
                      <li key={u._id} className="py-2 border-b border-gray-100">
                        <div className="font-semibold">
                          {u.firstName} {u.lastName}
                        </div>
                        <div className="text-xs text-gray-500">{u.email}</div>

                        <button
                          className="mt-1 text-xs text-blue-600 hover:underline"
                          onClick={() => handleChatWithUser(u._id)}
                        >
                          Chat with user
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>No actual users found.</div>
                )}
              </>
            )}
          </div>
        )}

        {/* 4) TEAMS TAB => "teams" from teamApi */}
        {activeTab === 'teams' && (
          <div className="p-4 text-sm text-gray-600">
            {teamsLoading && <div>Loading teams...</div>}
            {teamsError && <div>Failed to load teams.</div>}

            {teams && teams.length > 0 ? (
              <ul>
                {teams.map((team) => {
                  const isExpanded = expandedTeamId === team._id;
                  return (
                    <li key={team._id} className="py-2 border-b border-gray-100">
                      <div className="font-semibold flex items-center justify-between">
                        <div>
                          <p>{team.name}</p>
                          <p className="text-xs text-gray-500">{team.description}</p>
                        </div>
                        <button
                          onClick={() => handleExpandTeam(team._id)}
                          className="text-xs text-blue-600 hover:underline ml-4"
                        >
                          {isExpanded ? 'Hide Members' : 'Show Members'}
                        </button>
                      </div>

                      {/* Chat with entire team */}
                      <button
                        onClick={() => createTeamChat(team._id)}
                        className="mt-1 text-xs text-blue-600 hover:underline"
                      >
                        Chat with this team
                      </button>

                      {/* If expanded, show members */}
                      {isExpanded && (
                        <TeamMembersList
                          teamId={team._id}
                          myUserId={user?._id}
                          onSelectConversation={onSelectConversation}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              !teamsLoading && !teamsError && (
                <div>No teams found for this organization.</div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
