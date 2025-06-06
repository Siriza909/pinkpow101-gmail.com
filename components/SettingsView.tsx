import React from 'react';
import { NotificationPreferences } from '../types';

interface SettingsViewProps {
  notificationPreferences: NotificationPreferences;
  onUpdateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  notificationPreferences, 
  onUpdateNotificationPreferences,
}) => {

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onUpdateNotificationPreferences({ [name]: checked });
  };
  
  const themedCheckboxClass = "h-5 w-5 sm:h-6 sm:w-6 text-accent-theme border-border-theme rounded focus:ring-accent-theme focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg-theme bg-input-bg-theme";
  const themedLabelClass = "ml-3 block text-md sm:text-lg text-text-theme";
  const themedButtonBase = "px-6 py-3 rounded-lg font-semibold transition-colors duration-150 ease-in-out transform hover:opacity-90 text-lg shadow-button-theme focus:outline-none focus:ring-2 focus:ring-accent-theme/50";

  const handleRequestPermissionClick = () => {
    onUpdateNotificationPreferences({ enabled: true });
  };

  return (
    <div className="p-4 sm:p-6 bg-card-bg-theme text-text-theme rounded-xl shadow-card-theme border border-border-theme max-w-2xl mx-auto font-main">
      <h2 className="text-3xl sm:text-4xl font-semibold text-text-theme mb-10 text-center font-heading">ตั้งค่าแอป</h2>

      <div className="p-4 sm:p-5 border border-border-theme rounded-lg shadow-sm">
        <h3 className="text-xl sm:text-2xl font-semibold text-text-theme mb-5 font-heading">การแจ้งเตือน</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="enabled"
              name="enabled"
              type="checkbox"
              checked={notificationPreferences.enabled && typeof Notification !== 'undefined' && Notification.permission === "granted"}
              onChange={handleNotificationChange}
              disabled={typeof Notification !== 'undefined' && Notification.permission === "denied"}
              className={themedCheckboxClass}
            />
            <label htmlFor="enabled" className={themedLabelClass}>
              เปิดใช้งานการแจ้งเตือนออเดอร์
            </label>
          </div>
          {typeof Notification !== 'undefined' && Notification.permission === "denied" && (
            <p className="text-sm text-error-theme ml-9">การอนุญาตแจ้งเตือนถูกปฏิเสธโดยเบราว์เซอร์ของคุณ กรุณาอัปเดตการตั้งค่าเบราว์เซอร์</p>
          )}

          {notificationPreferences.enabled && typeof Notification !== 'undefined' && Notification.permission === "granted" && (
            <>
              <div className="flex items-center ml-9">
                <input
                  id="sound"
                  name="sound"
                  type="checkbox"
                  checked={notificationPreferences.sound}
                  onChange={handleNotificationChange}
                  className={themedCheckboxClass}
                />
                <label htmlFor="sound" className={themedLabelClass}>
                  เปิดใช้งานเสียง
                </label>
              </div>
              <div className="flex items-center ml-9">
                <input
                  id="vibrate"
                  name="vibrate"
                  type="checkbox"
                  checked={notificationPreferences.vibrate}
                  onChange={handleNotificationChange}
                  className={themedCheckboxClass}
                />
                <label htmlFor="vibrate" className={themedLabelClass}>
                  เปิดใช้งานการสั่น (หากอุปกรณ์รองรับ)
                </label>
              </div>
            </>
          )}
        </div>
      </div>
       {typeof Notification !== 'undefined' && Notification.permission === "default" && (
          <button 
            onClick={handleRequestPermissionClick}
            className={`${themedButtonBase} mt-8 w-full bg-accent-theme text-button-text-theme hover:bg-accent-hover-theme`}
          >
            ขออนุญาตแสดงการแจ้งเตือน
          </button>
        )}
    </div>
  );
};

export default SettingsView;