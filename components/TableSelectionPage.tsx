import React from 'react';
import { Table, Reservation } from '../types';

interface TableSelectionPageProps {
  tables: Table[];
  reservations: Reservation[];
  onSelectTable: (table: Table) => void; 
  onReserveTableTrigger: (table: Table) => void; 
}

const TableSelectionPage: React.FC<TableSelectionPageProps> = ({ tables, reservations, onSelectTable, onReserveTableTrigger }) => {
  
  const getStatusStyles = (status: Table['status']): string => {
    switch (status) {
      case 'available':
        return 'bg-success-theme/80 text-white hover:bg-success-theme';
      case 'reserved':
        return 'bg-info-theme/80 text-white hover:bg-info-theme';
      case 'occupied':
        return 'bg-error-theme/80 text-white hover:bg-error-theme';
      default:
        return 'bg-card-bg-theme text-text-theme border border-border-theme hover:bg-border-theme';
    }
  };

  const getReservationInfoText = (table: Table): string | null => {
    if (table.status === 'reserved' && table.currentReservationId) {
      const reservation = reservations.find(r => r.id === table.currentReservationId);
      return reservation ? `จอง: ${reservation.name} (${reservation.time})` : 'จองแล้ว';
    }
    // No need to show "กำลังใช้งาน" from reservation info, as "occupied" status already indicates this.
    return null;
  };

  const handleTableClick = (table: Table) => {
    if (table.status === 'available') {
      onReserveTableTrigger(table); 
    } else {
      onSelectTable(table); 
    }
  };

  return (
    <div className="p-4 sm:p-6 font-main">
      <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-10 font-heading text-text-theme">เลือกโต๊ะ</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
        {tables.map((table) => {
          const infoText = getReservationInfoText(table);
          const displayStatus = table.status === 'available' ? 'ว่าง' :
                                table.status === 'reserved' ? 'จองแล้ว' : 'กำลังใช้งาน';
          return (
            <button
              key={table.id}
              onClick={() => handleTableClick(table)}
              className={`p-3 sm:p-4 rounded-xl shadow-card-theme hover:shadow-card-hover-theme transition-all duration-200 aspect-square flex flex-col items-center justify-center text-center transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent-theme focus:ring-offset-2 focus:ring-offset-bg-theme
                          ${getStatusStyles(table.status)}`}
              aria-label={`โต๊ะ ${table.number} - สถานะ: ${displayStatus}`}
            >
              <span className="text-2xl sm:text-3xl font-bold">{table.number}</span>
              <span className="text-xs sm:text-sm mt-1 capitalize">
                {displayStatus}
              </span>
              {infoText && <span className="text-xs mt-0.5 truncate w-full px-1">{infoText}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TableSelectionPage;