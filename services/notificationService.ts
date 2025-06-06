import { NotificationPreferences, CustomNotificationOptions } from '../types';

// เสียงบี๊บสั้นๆ ง่ายๆ (ไฟล์ WAV ที่เข้ารหัสเป็น Base64)
// นี่เป็นเสียงบี๊บสั้นๆ ทั่วไป คุณสามารถแทนที่ด้วยเสียงที่คุณกำหนดเองได้
// หากต้องการสร้างใหม่ คุณสามารถใช้เครื่องมือออนไลน์เพื่อแปลงไฟล์เสียงสั้นๆ (เช่น .wav หรือ .mp3) เป็น Base64
const NOTIFICATION_SOUND_B64 = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YUรีข==";


export const NotificationService = {
  async requestPermission(): Promise<NotificationPermission> {
    try {
      // Check if Notification API is available
      if (!('Notification' in window)) {
        console.warn('เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือนบนเดสก์ท็อป');
        return 'denied';
      }
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการขออนุญาตแจ้งเตือน:", error);
      return "denied"; // Default to denied on error
    }
  },

  showNotification(title: string, options?: CustomNotificationOptions): void {
    if (!('Notification' in window)) {
      console.warn('เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือนบนเดสก์ท็อป ไม่สามารถแสดงการแจ้งเตือนได้');
      return;
    }
    if (Notification.permission === "granted") {
      new Notification(title, options);
    } else if (Notification.permission !== "denied") {
      // If permission is default, we might want to request it first
      // However, showNotification is usually called *after* permission is expected to be granted
      console.warn("ยังไม่ได้รับอนุญาตให้แสดงการแจ้งเตือน กรุณาขออนุญาตก่อน");
    }
  },

  playSound(): void {
    if (typeof Audio !== "undefined") {
      try {
        const audio = new Audio(NOTIFICATION_SOUND_B64);
        audio.play().catch(error => console.error("เกิดข้อผิดพลาดในการเล่นเสียง:", error));
      } catch (e) {
        console.error("ไม่สามารถเล่นเสียงได้:", e);
      }
    }
  },

  // Centralized function to update preferences and handle permission requests
  async updatePreferences(
    prefsToUpdate: Partial<NotificationPreferences>,
    currentPrefs: NotificationPreferences,
    setNotificationPreferencesState: (callback: (prefs: NotificationPreferences) => NotificationPreferences) => void
  ): Promise<void> {
    const newEnabledState = prefsToUpdate.enabled !== undefined ? prefsToUpdate.enabled : currentPrefs.enabled;

    if (newEnabledState && Notification.permission === "default") {
      const permission = await this.requestPermission();
      if (permission === "granted") {
        setNotificationPreferencesState(prev => ({ ...prev, ...prefsToUpdate, enabled: true }));
        // alert("อนุญาตการแจ้งเตือนแล้ว!"); // Alert can be handled by the caller if needed
      } else {
        alert("การอนุญาตแจ้งเตือนถูกปฏิเสธ กรุณาเปิดใช้งานในการตั้งค่าเบราว์เซอร์ของคุณหากต้องการรับการแจ้งเตือน");
        setNotificationPreferencesState(prev => ({ ...prev, ...prefsToUpdate, enabled: false }));
      }
    } else if (newEnabledState && Notification.permission === "denied") {
      alert("การอนุญาตแจ้งเตือนถูกปฏิเสธในขณะนี้ กรุณาเปิดใช้งานในการตั้งค่าเบราว์เซอร์ของคุณ");
      setNotificationPreferencesState(prev => ({ ...prev, ...prefsToUpdate, enabled: false }));
    } else {
      // Apply other preference changes (sound, vibrate) or if permission is already granted
      setNotificationPreferencesState(prev => ({ ...prev, ...prefsToUpdate }));
    }
  }
};