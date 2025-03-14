import React, { useState } from "react";
import { motion } from "framer-motion";
import UserSettings from "./UserSettings";
import UserSettingManager from "./UserSettingManager";

const tabs = [
  { id: "general", label: "Theme & Display" },
  { id: "advanced", label: "Advanced Settings" },
];

const SettingsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="mx-auto mt-10 bg-white dark:bg-gray-100 p-6 rounded-lg shadow-lg">
      {/* Tab Navigation */}
      <div className="flex border-b dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-gray-900 dark:text-gray-300 transition-all 
              ${activeTab === tab.id ? "border-b-4 border-blue-500 text-blue-600 dark:text-blue-400" : "hover:text-blue-500"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content with Motion Animation */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="mt-6"
      >
        {activeTab === "general" && <UserSettings />}
        {activeTab === "advanced" && <UserSettingManager />}
      </motion.div>
    </div>
  );
};

export default SettingsTab;
