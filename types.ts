export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
}

export interface GeminiDishSuggestion {
  name: string;
  description: string;
  category: string;
}

export enum AppView {
  MENU = 'MENU',
  GEMINI_CHEF = 'GEMINI_CHEF',
  ADMIN = 'ADMIN',
  SETTINGS = 'SETTINGS',
  BILL_CHECKOUT = 'BILL_CHECKOUT',
  EXPENSE_LOG = 'EXPENSE_LOG', 
  SUMMARY_REPORT = 'SUMMARY_REPORT',
  TABLE_SELECTION = 'TABLE_SELECTION',
  TABLE_BILL_MANAGER = 'TABLE_BILL_MANAGER',
  ATTENDANCE_LOG = 'ATTENDANCE_LOG' // For future attendance feature
}

export interface NotificationPreferences {
  enabled: boolean;
  sound: boolean;
  vibrate: boolean;
}

export interface CustomNotificationOptions extends NotificationOptions {
  vibrate?: number[];
}

export interface Order {
  id: string;
  tableNumber: string;
  items: CartItem[];
  totalAmount: number;
  timestamp: string;
  orderStatus?: 'pending' | 'preparing' | 'ready' | 'served' | 'paid';
}

export type Expense = {
  id: string;
  description: string;
  amount: number;
  category: 'วัตถุดิบ' | 'ค่าแรง' | 'บำรุงรักษา' | 'อื่น ๆ'; // Added category
  timestamp: string; // Full ISO string
  paidBy: string; 
  paymentMethod: 'เงินสด' | 'โอน' | 'บัตรเครดิต' | 'เช็ค' | 'อื่น ๆ'; 
  time?: string; // Optional HH:mm
  isPaid: boolean; 
};

export interface ExpenseCreationData {
  description: string;
  amount: number;
  category: Expense['category']; // Added category
  date: string; // YYYY-MM-DD from form
  time?: string; // HH:mm from form
  paidBy: string;
  paymentMethod: Expense['paymentMethod'];
  isPaid: boolean;
}

export interface ShiftBill {
  id: string;
  tableId: string;
  startTime: string;
  endTime?: string;
  orders: Order[];
  expenses: Expense[];
  isClosed: boolean;
}

export type Theme = 'orange-dark' | 'light';

export interface Table {
  id: string;
  number: string; 
  status: 'available' | 'reserved' | 'occupied';
  currentReservationId?: string;
  currentShiftId?: string; 
}

export interface Reservation {
  id: string;
  tableId: string;
  name: string;
  partySize: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  contact?: string; 
  notes?: string; 
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  checkInTime?: string;   // ISO timestamp
  checkInPhoto?: string;  // base64 data URL
  checkOutTime?: string;  // ISO timestamp
  checkOutPhoto?: string; // base64 data URL
  leaveType?: 'ลาป่วย' | 'ลากิจ' | 'ลาพักร้อน' | 'อื่น ๆ';
  leaveDate?: string; // YYYY-MM-DD, if it's a leave record
  leaveNotes?: string;
  isLeaveRequest: boolean; // True if this record is a leave request
}