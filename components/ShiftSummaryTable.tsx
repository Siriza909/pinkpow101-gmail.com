import React from 'react';
import { ShiftBill } from '../types';

interface ShiftSummaryTableProps {
  shift: ShiftBill | null;
}

const ShiftSummaryTable: React.FC<ShiftSummaryTableProps> = ({ shift }) => {
  if (!shift) {
    return <p className="text-text-muted-theme text-center py-4 text-lg">ยังไม่มีข้อมูลรอบบิลให้แสดง หรือรอบบิลยังไม่ถูกเปิด</p>;
  }

  const totalIncome = shift.orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalExpensesInShift = shift.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const profit = totalIncome - totalExpensesInShift;

  const themedSummaryCardClass = "bg-bg-theme p-4 rounded-lg shadow-sm border border-border-theme text-center";
  const themedSummaryTitleClass = "text-md sm:text-lg font-semibold text-text-muted-theme mb-1";
  const themedSummaryAmountBaseClass = "text-xl sm:text-2xl font-bold";
  const listItemClass = "text-sm p-2.5 bg-card-bg-theme/50 rounded border border-border-theme/50 hover:bg-bg-theme transition-colors";

  return (
    <div className="text-text-theme space-y-6 font-main">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={themedSummaryCardClass}>
          <h4 className={themedSummaryTitleClass}>รายรับรวม (จากออเดอร์)</h4>
          <p className={`${themedSummaryAmountBaseClass} text-success-theme`}>฿{totalIncome.toFixed(2)}</p>
        </div>
        <div className={themedSummaryCardClass}>
          <h4 className={themedSummaryTitleClass}>รายจ่ายรวม (ในรอบบิลนี้)</h4>
          <p className={`${themedSummaryAmountBaseClass} text-error-theme`}>฿{totalExpensesInShift.toFixed(2)}</p>
        </div>
        <div className={themedSummaryCardClass}>
          <h4 className={themedSummaryTitleClass}>กำไร/ขาดทุนสุทธิ (รอบบิลนี้)</h4>
          <p className={`${themedSummaryAmountBaseClass} ${profit >= 0 ? 'text-info-theme' : 'text-error-theme'}`}>
            ฿{profit.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <h5 className="text-xl font-semibold mb-3 text-text-theme">รายการออเดอร์ ({shift.orders.length})</h5>
          {shift.orders.length === 0 ? (
            <p className="text-md text-text-muted-theme py-2">ยังไม่มีออเดอร์ในรอบบิลนี้</p>
          ) : (
            <ul className="space-y-2.5 max-h-72 overflow-y-auto pr-1.5 -mr-1.5">
              {shift.orders.slice().sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(order => (
                <li key={order.id} className={listItemClass}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">โต๊ะ: {order.tableNumber} (ID: {order.id.slice(-4)})</span>
                    <span className="font-semibold text-success-theme">฿{order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-text-muted-theme mt-0.5">
                   เมื่อ: {new Date(order.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <ul className="mt-1 pl-3 text-xs">
                    {order.items.map(item => (
                        <li key={item.foodItem.id} className="text-text-muted-theme/80">{item.foodItem.name} x{item.quantity}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h5 className="text-xl font-semibold mb-3 text-text-theme">รายการรายจ่าย ({shift.expenses.length})</h5>
          {shift.expenses.length === 0 ? (
            <p className="text-md text-text-muted-theme py-2">ยังไม่มีรายจ่ายในรอบบิลนี้</p>
          ) : (
            <ul className="space-y-2.5 max-h-72 overflow-y-auto pr-1.5 -mr-1.5">
              {shift.expenses.slice().sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(exp => (
                <li key={exp.id} className={listItemClass}>
                   <div className="flex justify-between items-center">
                    <span className="font-medium truncate max-w-[70%]">{exp.description}</span>
                    <span className="font-semibold text-error-theme">฿{exp.amount.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-text-muted-theme mt-0.5">
                    {exp.category} | โดย: {exp.paidBy} ({exp.paymentMethod})
                    <br/>
                    สถานะ: <span className={exp.isPaid ? 'text-success-theme/80' : 'text-error-theme/80'}>{exp.isPaid ? 'ชำระแล้ว' : 'ค้างจ่าย'}</span> |
                    เมื่อ: {new Date(exp.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} {exp.time ? `(${exp.time})` : ''}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShiftSummaryTable;