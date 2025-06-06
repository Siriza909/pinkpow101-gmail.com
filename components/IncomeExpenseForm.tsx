import React, { useState } from 'react';
import { ExpenseCreationData } from '../types'; 
import { ExpenseCategoryTuple, PaymentMethodTuple, ExpenseCategory as ExpenseCategoryType, PaymentMethod as PaymentMethodType } from './ExpenseLogPage'; 

const expenseCategories: ExpenseCategoryTuple = ['วัตถุดิบ', 'ค่าแรง', 'บำรุงรักษา', 'อื่น ๆ'];
const paymentMethodOptions: PaymentMethodTuple = ['เงินสด', 'โอน', 'บัตรเครดิต', 'เช็ค', 'อื่น ๆ'];


interface IncomeExpenseFormProps {
  onAddExpense: (expenseData: ExpenseCreationData) => void; 
}

const IncomeExpenseForm: React.FC<IncomeExpenseFormProps> = ({ onAddExpense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategoryType>('วัตถุดิบ');
  const [paidBy, setPaidBy] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('เงินสด');
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  });
  const [isPaid, setIsPaid] = useState(true);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount.trim() || !paidBy.trim() || !date) {
      alert('กรุณากรอกรายละเอียด, จำนวนเงิน, ผู้จ่าย, และวันที่');
      return;
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('จำนวนเงินต้องเป็นตัวเลขที่มากกว่าศูนย์');
      return;
    }
    
    const expenseDataForApp: ExpenseCreationData = { 
      description, 
      amount: numericAmount, 
      category,
      paidBy,
      paymentMethod,
      date, 
      time: time || undefined, 
      isPaid,
    };

    onAddExpense(expenseDataForApp);
    
    // Reset form
    setDescription('');
    setAmount('');
    setCategory('วัตถุดิบ');
    setPaidBy('');
    setPaymentMethod('เงินสด');
    const now = new Date();
    setTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    setDate(now.toISOString().slice(0,10));
    setIsPaid(true);
  };
  
  const themedInputClass = "w-full p-3 bg-input-bg-theme text-input-text-theme border border-input-border-theme rounded-lg focus:ring-2 focus:ring-accent-theme focus:border-accent-theme text-lg shadow-sm";
  const themedLabelClass = "block text-lg font-medium text-text-theme mb-1.5";
  const themedButtonBase = "px-6 py-3 rounded-lg font-semibold transition-colors duration-150 ease-in-out transform hover:opacity-90 text-lg shadow-button-theme focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg-theme focus:ring-accent-theme/80";
  const themedCheckboxClass = "h-5 w-5 sm:h-6 sm:w-6 text-accent-theme border-border-theme rounded focus:ring-accent-theme focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg-theme bg-input-bg-theme";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="shiftIncExpDescription" className={themedLabelClass}>รายละเอียดรายจ่าย:<span className="text-error-theme">*</span></label>
        <input 
          id="shiftIncExpDescription"
          type="text"
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="เช่น ค่าของสด, ค่าเครื่องดื่มสต๊อก" 
          className={themedInputClass}
          required 
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="shiftIncExpAmount" className={themedLabelClass}>จำนวนเงิน (บาท):<span className="text-error-theme">*</span></label>
          <input 
            id="shiftIncExpAmount"
            type="number" 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
            placeholder="0.00" 
            className={themedInputClass}
            step="0.01"
            min="0.01"
            required 
          />
        </div>
        <div>
          <label htmlFor="shiftIncExpCategory" className={themedLabelClass}>ประเภทรายจ่าย:<span className="text-error-theme">*</span></label>
          <select 
            id="shiftIncExpCategory"
            value={category} 
            onChange={e => setCategory(e.target.value as ExpenseCategoryType)} 
            className={`${themedInputClass} appearance-none`} 
            required
          >
            {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="shiftIncExpPaidBy" className={themedLabelClass}>จ่ายโดย:<span className="text-error-theme">*</span></label>
          <input 
            id="shiftIncExpPaidBy"
            type="text"
            value={paidBy} 
            onChange={e => setPaidBy(e.target.value)} 
            placeholder="เช่น ชื่อพนักงาน, ร้าน" 
            className={themedInputClass}
            required 
          />
        </div>
        <div>
          <label htmlFor="shiftIncExpPaymentMethod" className={themedLabelClass}>ช่องทางการชำระเงิน:<span className="text-error-theme">*</span></label>
          <select 
            id="shiftIncExpPaymentMethod"
            value={paymentMethod} 
            onChange={e => setPaymentMethod(e.target.value as PaymentMethodType)} 
            className={`${themedInputClass} appearance-none`} 
            required
          >
            {paymentMethodOptions.map(method => <option key={method} value={method}>{method}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
            <label htmlFor="shiftIncExpDate" className={themedLabelClass}>วันที่จ่าย:<span className="text-error-theme">*</span></label>
            <input id="shiftIncExpDate" type="date" value={date} onChange={e => setDate(e.target.value)} className={themedInputClass} required />
        </div>
        <div>
          <label htmlFor="shiftIncExpTime" className={themedLabelClass}>เวลาที่จ่าย (ถ้ามี):</label>
          <input 
            id="shiftIncExpTime"
            type="time"
            value={time} 
            onChange={e => setTime(e.target.value)} 
            className={themedInputClass}
          />
        </div>
      </div>
       <div className="flex items-center pt-2">
            <input
              id="shiftIncExpIsPaid"
              name="shiftIncExpIsPaid"
              type="checkbox"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
              className={themedCheckboxClass}
            />
            <label htmlFor="shiftIncExpIsPaid" className={`${themedLabelClass} ml-3 !mb-0`}>
              ชำระแล้ว
            </label>
        </div>
      <button 
        type="submit" 
        className={`${themedButtonBase} bg-accent-theme text-button-text-theme hover:bg-accent-hover-theme w-full`}
      >
        เพิ่มรายจ่ายในรอบบิลนี้
      </button>
    </form>
  );
};

export default IncomeExpenseForm;