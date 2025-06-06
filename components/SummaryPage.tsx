import React from 'react';
import { Order, Expense, ShiftBill } from '../types'; // Added ShiftBill

type Props = {
  orders: Order[];
  expenses: Expense[];
  shiftBills: ShiftBill[]; // Added
};

const SummaryPage: React.FC<Props> = ({ orders, expenses, shiftBills }) => {
  const totalIncome = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalExpensesAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpensesAmount;

  const expensesByCategory = expenses.reduce<Record<string, { total: number, count: number }>>((acc, e) => {
    if (!acc[e.category]) {
      acc[e.category] = { total: 0, count: 0 };
    }
    acc[e.category].total += e.amount;
    acc[e.category].count += 1;
    return acc;
  }, {});

  const sortedExpenseCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b.total - a.total);

  const themedSummaryCardClass = "bg-card-bg-theme text-text-theme p-5 rounded-xl shadow-card-theme border border-border-theme text-center";
  const themedSummaryTitleClass = "text-xl sm:text-2xl font-semibold text-text-theme mb-2 font-heading";
  const themedSummaryAmountBaseClass = "text-3xl sm:text-4xl font-bold";

  return (
    <div className="p-4 sm:p-6 bg-card-bg-theme text-text-theme rounded-xl shadow-card-theme border border-border-theme max-w-4xl mx-auto font-main">
      <h2 className="text-3xl sm:text-4xl font-semibold text-text-theme mb-10 text-center font-heading">สรุปภาพรวม (ทั้งหมด)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-10">
        <div className={themedSummaryCardClass}>
          <h3 className={themedSummaryTitleClass}>รายรับรวม</h3>
          <p className={`${themedSummaryAmountBaseClass} text-success-theme`}>฿{totalIncome.toFixed(2)}</p>
        </div>
        <div className={themedSummaryCardClass}>
          <h3 className={themedSummaryTitleClass}>รายจ่ายรวม</h3>
          <p className={`${themedSummaryAmountBaseClass} text-error-theme`}>฿{totalExpensesAmount.toFixed(2)}</p>
        </div>
        <div className={themedSummaryCardClass}>
          <h3 className={themedSummaryTitleClass}>กำไรสุทธิ</h3>
          <p className={`${themedSummaryAmountBaseClass} ${netProfit >= 0 ? 'text-info-theme' : 'text-error-theme'}`}>
            ฿{netProfit.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-border-theme">
        <h3 className="text-2xl sm:text-3xl font-semibold text-text-theme mb-6 text-center font-heading">รายละเอียดรายจ่ายตามประเภท (ทั้งหมด)</h3>
        {expenses.length === 0 ? (
           <p className="text-center text-lg text-text-muted-theme py-6">ยังไม่มีรายการรายจ่ายที่บันทึกไว้</p>
        ) : (
        <div className="space-y-4">
          {sortedExpenseCategories.map(([category, data]) => (
            <div key={category} className="p-4 bg-bg-theme rounded-lg shadow-sm border border-border-theme flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <p className="text-lg font-medium text-text-theme">{category}</p>
                <p className="text-sm text-text-muted-theme">({data.count} รายการ)</p>
              </div>
              <p className="text-lg font-semibold text-error-theme mt-1 sm:mt-0">฿{data.total.toFixed(2)}</p>
            </div>
          ))}
        </div>
        )}
      </div>

      {sortedExpenseCategories.length > 0 && (
         <div className="mt-10 pt-6 border-t border-border-theme">
            <h3 className="text-2xl sm:text-3xl font-semibold text-text-theme mb-5 text-center font-heading">จุดที่สิ้นเปลืองมากที่สุด (ทั้งหมด)</h3>
            <p className="text-center text-xl sm:text-2xl text-text-theme">
                <span className="font-bold text-text-theme">{sortedExpenseCategories[0][0]}</span>: <span className="text-error-theme font-semibold">฿{sortedExpenseCategories[0][1].total.toFixed(2)}</span>
            </p>
         </div>
      )}

      {/* Basic Shift Info */}
      <div className="mt-10 pt-6 border-t border-border-theme">
        <h3 className="text-2xl sm:text-3xl font-semibold text-text-theme mb-5 text-center font-heading">ข้อมูลรอบบิล</h3>
        <p className="text-center text-lg text-text-theme">จำนวนรอบบิลทั้งหมดที่บันทึก: <span className="font-bold">{shiftBills.length}</span></p>
        {/* Further per-shift summary can be added later */}
      </div>
    </div>
  );
};

export default SummaryPage;