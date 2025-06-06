import React, { useMemo } from 'react';
import { Table, ShiftBill, Expense, ExpenseCreationData } from '../types';
import IncomeExpenseForm from './IncomeExpenseForm';
import ShiftSummaryTable from './ShiftSummaryTable';

interface TableBillManagerPageProps {
  table: Table;
  shiftBills: ShiftBill[];
  onOpenShift: (tableId: string) => ShiftBill | void;
  onCloseShift: (shiftId: string) => void;
  onAddExpenseToShift: (expenseData: ExpenseCreationData) => void; 
  onNavigateBack: () => void;
}

const TableBillManagerPage: React.FC<TableBillManagerPageProps> = ({
  table,
  shiftBills,
  onOpenShift,
  onCloseShift,
  onAddExpenseToShift,
  onNavigateBack,
}) => {
  const currentOpenShiftForTable = useMemo(() => {
    return shiftBills.find(shift => shift.id === table.currentShiftId && !shift.isClosed);
  }, [shiftBills, table.currentShiftId]);

  const themedButtonBase = "w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-colors duration-150 ease-in-out transform hover:opacity-90 text-lg shadow-button-theme focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg-theme focus:ring-accent-theme/80";

  return (
    <div className="p-4 sm:p-6 bg-card-bg-theme text-text-theme rounded-xl shadow-card-theme border border-border-theme font-main max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-border-theme">
        <h2 className="text-3xl sm:text-4xl font-semibold font-heading text-center sm:text-left mb-3 sm:mb-0">
          จัดการบิล - โต๊ะ <span className="text-accent-theme">{table.number}</span>
        </h2>
        <button
          onClick={onNavigateBack}
          className={`${themedButtonBase} bg-card-bg-theme text-text-theme border border-border-theme hover:bg-border-theme`}
        >
          กลับไปเลือกโต๊ะ
        </button>
      </div>

      <div className="mb-8 p-4 bg-bg-theme rounded-lg border border-border-theme shadow-sm">
        <h3 className="text-2xl font-semibold mb-4 text-highlight-theme">การจัดการรอบบิล</h3>
        {!currentOpenShiftForTable ? (
          <button
            onClick={() => onOpenShift(table.id)}
            className={`${themedButtonBase} bg-success-theme text-white w-full`}
          >
            เริ่มรอบบิลใหม่สำหรับโต๊ะนี้
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-lg text-text-theme">
              รอบบิลปัจจุบัน เริ่มเมื่อ: <span className="font-semibold text-text-theme">{new Date(currentOpenShiftForTable.startTime).toLocaleString('th-TH')}</span>
            </p>
            <button
              onClick={() => {
                if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการปิดรอบบิลนี้? การกระทำนี้ไม่สามารถย้อนกลับได้ และจะอัปเดตสถานะโต๊ะ (ถ้าไม่มีการจองใหม่)')) {
                  onCloseShift(currentOpenShiftForTable.id);
                }
              }}
              className={`${themedButtonBase} bg-error-theme text-white w-full`}
            >
              ปิดรอบบิลปัจจุบันของโต๊ะนี้
            </button>
          </div>
        )}
      </div>
      
      {currentOpenShiftForTable && (
        <>
          <div className="my-8 p-4 bg-bg-theme rounded-lg border border-border-theme shadow-sm">
            <h3 className="text-2xl font-semibold mb-4 text-highlight-theme">เพิ่มรายจ่ายในรอบบิลนี้</h3>
            <IncomeExpenseForm onAddExpense={onAddExpenseToShift} />
          </div>

          <div className="my-8 p-4 bg-bg-theme rounded-lg border border-border-theme shadow-sm">
            <h3 className="text-2xl font-semibold mb-4 text-highlight-theme">สรุปยอดรอบบิลปัจจุบัน</h3>
            <ShiftSummaryTable shift={currentOpenShiftForTable} />
          </div>
        </>
      )}
      {!currentOpenShiftForTable && table.status === 'occupied' && !table.currentShiftId && (
        <p className="text-center text-xl text-info-theme mt-10">
          โต๊ะนี้ถูกระบุว่า "กำลังใช้งาน" แต่ยังไม่มีรอบบิลที่เปิดในระบบ กรุณา "เริ่มรอบบิลใหม่สำหรับโต๊ะนี้"
        </p>
      )}
      {!currentOpenShiftForTable && table.status !== 'occupied' &&(
         <p className="text-center text-xl text-text-muted-theme mt-10">
          กรุณาเริ่มรอบบิลใหม่เพื่อบันทึกออเดอร์และรายจ่ายสำหรับโต๊ะนี้
        </p>
      )}
    </div>
  );
};

export default TableBillManagerPage;