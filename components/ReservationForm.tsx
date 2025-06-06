import React, { useState } from 'react';
import { Table, Reservation } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';

interface ReservationFormProps {
  table: Table;
  onReserve: (reservationData: Omit<Reservation, 'id' | 'tableId'> & { tableId: string }) => void;
  onCancel: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ table, onReserve, onCancel }) => {
  const [name, setName] = useState('');
  const [partySize, setPartySize] = useState<number | string>(1);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('19:00');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('กรุณากรอกชื่อผู้จอง');
      return;
    }
    const numPartySize = Number(partySize);
    if (isNaN(numPartySize) || numPartySize <= 0) {
      alert('กรุณากรอกจำนวนคนที่ถูกต้อง (มากกว่า 0)');
      return;
    }

    onReserve({
      tableId: table.id,
      name,
      partySize: numPartySize,
      date,
      time,
      contact: contact.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  const themedInputClass = "w-full p-3 bg-input-bg-theme text-input-text-theme border border-input-border-theme rounded-lg focus:ring-2 focus:ring-accent-theme focus:border-accent-theme text-lg shadow-sm";
  const themedLabelClass = "block text-lg font-medium text-text-theme mb-1.5";
  const themedButtonBase = "px-6 py-3 rounded-lg font-semibold transition-colors duration-150 ease-in-out transform hover:opacity-90 text-lg shadow-button-theme focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg-theme focus:ring-accent-theme/80";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[110] p-4 font-main">
      <form 
        onSubmit={handleSubmit} 
        className="bg-card-bg-theme text-text-theme p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg border border-border-theme relative"
      >
        <button 
            type="button" 
            onClick={onCancel} 
            className="absolute top-3 right-3 text-text-muted-theme hover:text-text-theme p-1.5 rounded-full hover:bg-border-theme transition-colors"
            aria-label="ปิดฟอร์มจอง"
        >
            <XMarkIcon className="w-7 h-7"/>
        </button>

        <h3 className="text-2xl sm:text-3xl font-semibold text-center mb-6 font-heading text-text-theme">
          จองโต๊ะ <span className="text-accent-theme">{table.number}</span>
        </h3>
        
        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2 -mr-2">
            <div>
            <label htmlFor="resName" className={themedLabelClass}>ชื่อผู้จอง:<span className="text-error-theme">*</span></label>
            <input type="text" id="resName" value={name} onChange={e => setName(e.target.value)} className={themedInputClass} required />
            </div>
            
            <div>
            <label htmlFor="resPartySize" className={themedLabelClass}>จำนวนคน:<span className="text-error-theme">*</span></label>
            <input type="number" id="resPartySize" value={partySize} onChange={e => setPartySize(e.target.value === '' ? '' : Number(e.target.value))} min="1" className={themedInputClass} required />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="resDate" className={themedLabelClass}>วันที่:<span className="text-error-theme">*</span></label>
                <input type="date" id="resDate" value={date} onChange={e => setDate(e.target.value)} className={themedInputClass} required 
                min={new Date().toISOString().slice(0, 10)} />
            </div>
            <div>
                <label htmlFor="resTime" className={themedLabelClass}>เวลา:<span className="text-error-theme">*</span></label>
                <input type="time" id="resTime" value={time} onChange={e => setTime(e.target.value)} className={themedInputClass} required />
            </div>
            </div>

            <div>
            <label htmlFor="resContact" className={themedLabelClass}>ข้อมูลติดต่อ (โทรศัพท์/ไลน์):</label>
            <input type="text" id="resContact" value={contact} onChange={e => setContact(e.target.value)} placeholder="เช่น 08x-xxx-xxxx หรือ Line ID" className={themedInputClass} />
            </div>

            <div>
            <label htmlFor="resNotes" className={themedLabelClass}>หมายเหตุเพิ่มเติม:</label>
            <textarea id="resNotes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className={themedInputClass} placeholder="เช่น ขอโต๊ะริม, แพ้อาหารทะเล"/>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 mt-4 border-t border-border-theme">
          <button 
            type="button" 
            onClick={onCancel} 
            className={`${themedButtonBase} bg-bg-theme text-text-theme border border-border-theme hover:bg-border-theme w-full sm:w-auto`}
          >
            ยกเลิก
          </button>
          <button 
            type="submit" 
            className={`${themedButtonBase} bg-accent-theme text-button-text-theme hover:bg-accent-hover-theme w-full sm:w-auto`}
          >
            ยืนยันการจอง
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;