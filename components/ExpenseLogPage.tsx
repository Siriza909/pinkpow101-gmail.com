import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCreationData } from '../types';

const expenseCategories = ['วัตถุดิบ', 'ค่าแรง', 'บำรุงรักษา', 'อื่น ๆ'] as const;
export type ExpenseCategoryTuple = typeof expenseCategories; 
export type ExpenseCategory = ExpenseCategoryTuple[number];

const paymentMethodOptions = ['เงินสด', 'โอน', 'บัตรเครดิต', 'เช็ค', 'อื่น ๆ'] as const;
export type PaymentMethodTuple = typeof paymentMethodOptions; 
export type PaymentMethod = PaymentMethodTuple[number];

interface ExpenseLogPageProps {
  expenses: Expense[];
  onAddExpense: (expense: ExpenseCreationData) => void;
  editingExpense: Expense | null;
  onSetEditingExpense: (expense: Expense | null) => void;
  onUpdateExpense: (updatedExpense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
};

const ExpenseLogPage: React.FC<ExpenseLogPageProps> = ({ 
  expenses, 
  onAddExpense,
  editingExpense,
  onSetEditingExpense,
  onUpdateExpense,
  onDeleteExpense
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('วัตถุดิบ');
  const [paidBy, setPaidBy] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('เงินสด');
  const [time, setTime] = useState(''); // HH:mm format
  const [isPaid, setIsPaid] = useState(true);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10)); // YYYY-MM-DD

  useEffect(() => {
    if (editingExpense) {
      setDescription(editingExpense.description);
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setPaidBy(editingExpense.paidBy);
      setPaymentMethod(editingExpense.paymentMethod);
      setTime(editingExpense.time || '');
      setIsPaid(editingExpense.isPaid);
      setDate(editingExpense.timestamp.slice(0,10)); 
    } else {
      resetFormFields();
    }
  }, [editingExpense]);

  const resetFormFields = () => {
    setDescription('');
    setAmount('');
    setCategory('วัตถุดิบ');
    setPaidBy('');
    setPaymentMethod('เงินสด');
    setTime('');
    setIsPaid(true);
    setDate(new Date().toISOString().slice(0, 10));
  };
  
  const handleCancelEdit = () => {
    onSetEditingExpense(null); 
  };

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

    if (editingExpense) {
      const updatedExpensePayload: Expense = { 
        ...editingExpense,
        description,
        amount: numericAmount,
        category,
        paidBy,
        paymentMethod,
        time: time || undefined,
        isPaid,
        timestamp: new Date(`${date}T${time || '00:00:00'}`).toISOString()
      };
      onUpdateExpense(updatedExpensePayload);
    } else {
      const newExpenseData: ExpenseCreationData = {
        description,
        amount: numericAmount,
        category,
        paidBy,
        paymentMethod,
        date, 
        time: time || undefined,
        isPaid,
      };
      onAddExpense(newExpenseData);
    }
    onSetEditingExpense(null); // Reset editing state which triggers form reset via useEffect
  };
  
  const themedInputClass = "w-full p-3 bg-input-bg-theme text-input-text-theme border border-input-border-theme rounded-lg focus:ring-2 focus:ring-accent-theme focus:border-accent-theme text-lg shadow-sm";
  const themedLabelClass = "block text-lg font-medium text-text-theme mb-1.5";
  const themedButtonBase = "px-6 py-3 rounded-lg font-semibold transition-colors duration-150 ease-in-out transform hover:opacity-90 text-lg shadow-button-theme focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg-theme focus:ring-accent-theme/80";
  const themedCheckboxClass = "h-5 w-5 sm:h-6 sm:w-6 text-accent-theme border-border-theme rounded focus:ring-accent-theme focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg-theme bg-input-bg-theme";

  return (
    <div className="p-4 sm:p-6 bg-card-bg-theme text-text-theme rounded-xl shadow-card-theme border border-border-theme max-w-3xl mx-auto font-main">
      <h2 className="text-3xl sm:text-4xl font-semibold text-text-theme mb-8 text-center font-heading">
        {editingExpense ? 'แก้ไขรายจ่าย' : 'บันทึกรายจ่ายใหม่'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5 mb-10">
        <div>
          <label htmlFor="expenseDescription" className={themedLabelClass}>รายละเอียดรายจ่าย:<span className="text-error-theme">*</span></label>
          <input id="expenseDescription" type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="เช่น ค่าวัตถุดิบ, ค่าเช่าร้าน" className={themedInputClass} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="expenseAmount" className={themedLabelClass}>จำนวนเงิน (บาท):<span className="text-error-theme">*</span></label>
            <input id="expenseAmount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className={themedInputClass} step="0.01" min="0.01" required />
          </div>
          <div>
            <label htmlFor="expenseCategory" className={themedLabelClass}>ประเภทรายจ่าย:<span className="text-error-theme">*</span></label>
            <select id="expenseCategory" value={category} onChange={e => setCategory(e.target.value as ExpenseCategory)} className={`${themedInputClass} appearance-none`} required>
              {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="paidBy" className={themedLabelClass}>จ่ายโดย:<span className="text-error-theme">*</span></label>
          <input id="paidBy" type="text" value={paidBy} onChange={e => setPaidBy(e.target.value)} placeholder="เช่น ชื่อพนักงาน, ร้าน" className={themedInputClass} required />
        </div>
        <div>
          <label htmlFor="paymentMethod" className={themedLabelClass}>ช่องทางการชำระเงิน:<span className="text-error-theme">*</span></label>
          <select id="paymentMethod" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentMethod)} className={`${themedInputClass} appearance-none`} required>
            {paymentMethodOptions.map(method => <option key={method} value={method}>{method}</option>)}
          </select>
        </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="expenseDate" className={themedLabelClass}>วันที่จ่าย:<span className="text-error-theme">*</span></label>
                <input id="expenseDate" type="date" value={date} onChange={e => setDate(e.target.value)} className={themedInputClass} required />
            </div>
            <div>
                <label htmlFor="expenseTime" className={themedLabelClass}>เวลาที่จ่าย (ถ้ามี):</label>
                <input id="expenseTime" type="time" value={time} onChange={e => setTime(e.target.value)} className={themedInputClass} />
            </div>
        </div>
        <div className="flex items-center">
            <input id="isPaid" name="isPaid" type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} className={themedCheckboxClass}/>
            <label htmlFor="isPaid" className={`${themedLabelClass} ml-3 !mb-0`}>ชำระแล้ว</label>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button type="submit" className={`${themedButtonBase} bg-accent-theme text-button-text-theme hover:bg-accent-hover-theme flex-1`}>
            {editingExpense ? 'อัปเดตรายจ่าย' : 'เพิ่มรายจ่าย'}
          </button>
          {editingExpense && (
            <button type="button" onClick={handleCancelEdit} className={`${themedButtonBase} bg-card-bg-theme text-text-muted-theme border border-border-theme hover:bg-border-theme flex-1`}>
              ยกเลิกการแก้ไข
            </button>
          )}
        </div>
      </form>

      <div className="mt-12 pt-6 border-t border-border-theme">
        <h3 className="text-2xl sm:text-3xl font-semibold text-text-theme mb-6 text-center font-heading">รายการรายจ่ายทั้งหมด</h3>
        {expenses.length === 0 ? (
          <p className="text-center text-lg text-text-muted-theme py-6">ยังไม่มีรายการรายจ่ายที่บันทึกไว้</p>
        ) : (
          <div className="space-y-4">
            {expenses.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(e => (
              <div key={e.id} className="p-4 bg-bg-theme rounded-lg shadow-sm border border-border-theme">
                <div className="flex flex-col sm:flex-row justify-between items-start">
                  <div className="flex-grow mb-2 sm:mb-0">
                    <p className="text-lg font-medium text-text-theme">{e.description}</p>
                    <p className="text-md text-text-muted-theme">
                      {e.category} - <span className="text-xs">{new Date(e.timestamp).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour:'2-digit', minute:'2-digit' })} {e.time ? `(${e.time})` : ''}</span>
                    </p>
                    <p className="text-sm text-text-muted-theme">จ่ายโดย: {e.paidBy} ({e.paymentMethod}) - <span className={e.isPaid ? 'text-success-theme' : 'text-error-theme'}>{e.isPaid ? 'ชำระแล้ว' : 'ยังไม่ได้ชำระ'}</span></p>
                  </div>
                  <p className="text-lg font-semibold text-error-theme self-start sm:self-center sm:ml-4">฿{e.amount.toFixed(2)}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-border-theme/50 flex space-x-3 justify-end">
                    <button onClick={() => onSetEditingExpense(e)} className={`${themedButtonBase} !py-2 !px-4 !text-md bg-info-theme text-white hover:bg-info-theme/90`}>แก้ไข</button>
                    <button onClick={() => onDeleteExpense(e.id)} className={`${themedButtonBase} !py-2 !px-4 !text-md bg-error-theme text-white hover:bg-error-theme/90`}>ลบ</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseLogPage;