// File: src/components/chat/TeamMembersList.tsx
import React from 'react';
import { useListUsersInTeamQuery, UserTeamPivot } from '../../api/userTeam/userTeamApi';
import { useCreateConversationMutation } from '../../api/conversation/conversationApi';

interface TeamMembersListProps {
  teamId: string;
  myUserId?: string;
  onSelectConversation: (conversationId: string) => void;
}

const TeamMembersList: React.FC<TeamMembersListProps> = ({
  teamId,
  myUserId,
  onSelectConversation,
}) => {
  // fetch the pivot (userTeam) for all users in a team
  const { data: pivots, isLoading, isError } = useListUsersInTeamQuery(teamId);
  const [createConversation] = useCreateConversationMutation();

  const handleChatWithUser = async (otherUserId: string) => {
    if (!myUserId) return;
    try {
      const payload = {
        orgId: '', // you might pass the real selectedOrgId if needed
        participants: [myUserId, otherUserId],
      };
      const newConv = await createConversation(payload).unwrap();
      onSelectConversation(newConv._id);
    } catch (err) {
      console.error('Error creating 1-on-1 chat:', err);
    }
  };

  if (isLoading) return <div className="ml-4 text-xs text-gray-400">Loading members...</div>;
  if (isError) return <div className="ml-4 text-xs text-red-500">Failed to load team members</div>;
  if (!pivots || pivots.length === 0) {
    return <div className="ml-4 text-xs text-gray-400">No members in this team</div>;
  }

  return (
    <ul className="mt-2 ml-4 space-y-1">
      {pivots.map((pivot: UserTeamPivot) => {
        const userObj = typeof pivot.userId === 'object' ? pivot.userId : null;
        const userId = userObj ? userObj._id : pivot.userId;
        const userName = userObj
          ? `${userObj.firstName} ${userObj.lastName}`
          : `User ${userId}`;

        return (
          <li key={pivot._id} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700 text-sm">{userName}</p>
              {pivot.roleInTeam && (
                <p className="text-xs text-gray-500">Role: {pivot.roleInTeam}</p>
              )}
            </div>
            <button
              onClick={() => handleChatWithUser(userId as string)}
              className="text-xs text-blue-600 hover:underline ml-2"
            >
              Chat with user
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default TeamMembersList;
