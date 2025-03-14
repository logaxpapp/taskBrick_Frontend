import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGetUserSettingQuery, useUpdateUserSettingMutation } from "../../api/Settings/userSettingsApi";
import { useToastManager } from "../../components/UI/Toast/useToastManager";
import { useAppSelector} from '../../app/hooks/redux';
const UserSettingManager: React.FC = () => {
  const { selectedOrgId } = useAppSelector((state) => state.organization);

  
  const orgId = selectedOrgId;
  const { addToast } = useToastManager(); // ✅ Use toast manager
  const { data: userSetting, isLoading } = useGetUserSettingQuery(orgId!, { skip: !orgId });
  const [updateUserSetting, { isLoading: isUpdating }] = useUpdateUserSettingMutation();
  const [expirationHours, setExpirationHours] = useState<number>(48);

  useEffect(() => {
    if (userSetting) {
      setExpirationHours(userSetting.invitationExpirationHours);
    }
  }, [userSetting]);

  const handleUpdate = async () => {
    if (!orgId) return;
    try {
      await updateUserSetting({ userId: orgId, updates: { invitationExpirationHours: expirationHours } }).unwrap();
      addToast("Settings updated successfully!", "success"); // ✅ Use toast notification
    } catch (error) {
      addToast("Failed to update settings.", "error"); // ✅ Show error toast
    }
  };

  if (!orgId) return <p className="text-center text-gray-500">No organization selected.</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mb-4 mx-auto mt-10"
    >
      <div className="shadow-lg rounded-2xl p-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          User Settings
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-5">
            <span className="animate-spin border-4 border-gray-300 border-t-gray-700 rounded-full w-8 h-8"></span>
          </div>
        ) : (
          <>
            <motion.div
              className="mb-5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <label className="block text-gray-600 dark:text-gray-50 mb-1 text-sm">
                Invitation Expiration (Hours)
              </label>
              <input
                type="number"
                min={1}
                value={expirationHours}
                onChange={(e) => setExpirationHours(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </motion.div>

            <motion.div
              className="flex justify-end space-x-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
              >
                {isUpdating ? "Updating..." : "Save Changes"}
              </button>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default UserSettingManager;
