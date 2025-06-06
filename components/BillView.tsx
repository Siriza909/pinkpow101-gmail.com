import React, { useState, useMemo } from 'react';
import { Order, CartItem, FoodItem } from '../types'; 

interface BillViewProps {
  orders: Order[];
  onConfirmPayment: (tableNumber: string) => void;
  onNavigateBack: () => void;
}

type BillStep = 'tableSelection' | 'billDetails' | 'qrPayment' | 'paymentSuccess';

interface ConsolidatedBillItem {
  foodItem: FoodItem;
  quantity: number;
  totalItemPrice: number;
}

const BillView: React.FC<BillViewProps> = ({ orders, onConfirmPayment, onNavigateBack }) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<BillStep>('tableSelection');

  const tableNumbers = Array.from({ length: 40 }, (_, i) => (i + 1).toString());

  const ordersForSelectedTable = useMemo(() => {
    if (!selectedTable) return [];
    return orders.filter(order => order.tableNumber === selectedTable);
  }, [orders, selectedTable]);

  const consolidatedBill = useMemo((): ConsolidatedBillItem[] => {
    if (ordersForSelectedTable.length === 0) return [];
    
    const itemMap = new Map<string, ConsolidatedBillItem>();
    ordersForSelectedTable.forEach(order => {
      order.items.forEach(cartItem => {
        const existing = itemMap.get(cartItem.foodItem.id);
        if (existing) {
          existing.quantity += cartItem.quantity;
          existing.totalItemPrice += cartItem.foodItem.price * cartItem.quantity;
        } else {
          itemMap.set(cartItem.foodItem.id, {
            foodItem: cartItem.foodItem,
            quantity: cartItem.quantity,
            totalItemPrice: cartItem.foodItem.price * cartItem.quantity,
          });
        }
      });
    });
    return Array.from(itemMap.values());
  }, [ordersForSelectedTable]);

  const grandTotal = useMemo(() => {
    return consolidatedBill.reduce((sum, item) => sum + item.totalItemPrice, 0);
  }, [consolidatedBill]);
  
  const latestOrderTimestamp = useMemo(() => {
    if (ordersForSelectedTable.length === 0) return new Date().toISOString();
    return ordersForSelectedTable.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0].timestamp;
  }, [ordersForSelectedTable]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('th-TH', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };
  
  const qrCodeUrl = useMemo(() => {
    if (!selectedTable || grandTotal <= 0) return '';
    const paymentData = {
        table: selectedTable,
        amount: grandTotal.toFixed(2),
        timestamp: Date.now()
    };
    return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(JSON.stringify(paymentData))}&bgcolor=1e1e1e&color=e0e0e0&format=png`; // Dark theme QR
  }, [selectedTable, grandTotal]);

  const handleTableSelect = (tableNum: string) => {
    setSelectedTable(tableNum);
    setCurrentStep('billDetails');
  };

  const handleProceedToPayment = () => {
    setCurrentStep('qrPayment');
  };

  const handleConfirmAndPay = () => {
    if (selectedTable) {
      onConfirmPayment(selectedTable);
      setCurrentStep('paymentSuccess');
    }
  };

  const resetAndGoToTableSelection = () => {
    setSelectedTable(null);
    setCurrentStep('tableSelection');
  };
  
  const themedButtonBase = "w-full text-button-text-theme py-3.5 px-5 rounded-lg font-semibold transition-colors duration-150 ease-in-out transform hover:opacity-90 text-xl shadow-button-theme focus:outline-none focus:ring-2 focus:ring-accent-theme/50";
  const tableButtonClass = "p-3.5 rounded-lg font-semibold text-xl transition-colors duration-150 ease-in-out transform hover:scale-105 focus:outline-none text-text-theme";

  if (currentStep === 'tableSelection') {
    return (
      <div className="p-4 sm:p-6 bg-card-bg-theme text-text-theme rounded-xl shadow-card-theme border border-border-theme max-w-4xl mx-auto font-main">
        <h2 className="text-3xl sm:text-4xl font-semibold text-text-theme mb-8 text-center font-heading">เลือกโต๊ะสำหรับคิดเงิน</h2>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-3 sm:gap-4 mb-6">
          {tableNumbers.map(num => (
            <button
              key={num}
              onClick={() => handleTableSelect(num)}
              className={`${tableButtonClass} bg-bg-theme hover:bg-accent-theme hover:text-button-text-theme border border-border-theme`}
            >
              {num}
            </button>
          ))}
        </div>
        <button
          onClick={onNavigateBack}
          className={`${themedButtonBase} bg-card-bg-theme text-text-muted-theme hover:bg-border-theme hover:text-text-theme border border-border-theme mt-5`}
        >
          กลับไปหน้าหลัก
        </button>
      </div>
    );
  }

  if (currentStep === 'billDetails') {
    return (
      <div className="p-4 sm:p-6 bg-card-bg-theme text-text-theme rounded-xl shadow-card-theme border border-border-theme max-w-2xl mx-auto font-main">
        <h2 className="text-3xl sm:text-4xl font-semibold text-text-theme mb-6 text-center font-heading">ใบเสร็จ - โต๊ะ {selectedTable}</h2>
        {consolidatedBill.length === 0 ? (
          <p className="text-center text-xl text-text-muted-theme py-8">ไม่พบรายการสั่งซื้อสำหรับโต๊ะนี้</p>
        ) : (
          <>
            <div className="mb-5 text-md text-text-muted-theme">
              <p>วันที่: {formatTimestamp(latestOrderTimestamp)}</p>
            </div>
            <div className="space-y-2.5 mb-6 max-h-[50vh] overflow-y-auto pr-1.5 -mr-1.5">
              {consolidatedBill.map(item => (
                <div key={item.foodItem.id} className="flex justify-between items-center text-lg p-2.5 bg-bg-theme/50 rounded-md">
                  <div>
                    <span className="font-medium text-text-theme">{item.foodItem.name}</span> 
                    <span className="text-text-muted-theme"> (x{item.quantity})</span>
                  </div>
                  <span className="text-text-theme font-semibold">฿{item.totalItemPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-2xl sm:text-3xl font-bold mt-5 pt-5 border-t border-border-theme">
              <span className="text-text-theme">ยอดรวมสุทธิ:</span>
              <span className="text-accent-theme">฿{grandTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={handleProceedToPayment}
              className={`${themedButtonBase} bg-accent-theme hover:bg-accent-hover-theme mt-8`}
            >
              ชำระเงิน
            </button>
          </>
        )}
        <button
          onClick={resetAndGoToTableSelection}
          className={`${themedButtonBase} bg-card-bg-theme text-text-muted-theme hover:bg-border-theme hover:text-text-theme border border-border-theme mt-4`}
        >
          กลับไปเลือกโต๊ะ
        </button>
      </div>
    );
  }

  if (currentStep === 'qrPayment') {
    return (
      <div className="p-4 sm:p-6 bg-card-bg-theme text-text-theme rounded-xl shadow-card-theme border border-border-theme max-w-md mx-auto text-center font-main">
        <h2 className="text-2xl sm:text-3xl font-semibold text-text-theme mb-6 font-heading">สแกน QR Code เพื่อชำระเงิน</h2>
        <p className="mb-1 text-lg text-text-theme">โต๊ะ: {selectedTable}</p>
        <p className="mb-5 text-xl font-bold text-accent-theme">ยอดชำระ: ฿{grandTotal.toFixed(2)}</p>
        {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code สำหรับชำระเงิน" className="mx-auto mb-6 w-60 h-60 sm:w-64 sm:h-64 border-2 border-accent-theme rounded-lg p-1 bg-white" />}
        {!qrCodeUrl && <p className="text-error-theme">ไม่สามารถสร้าง QR Code ได้</p>}
        
        <button
          onClick={handleConfirmAndPay}
          className={`${themedButtonBase} bg-success-theme text-white hover:opacity-80 mt-6`}
        >
          ยืนยันการชำระเงินแล้ว
        </button>
        <button
          onClick={() => setCurrentStep('billDetails')}
          className={`${themedButtonBase} bg-card-bg-theme text-text-muted-theme hover:bg-border-theme hover:text-text-theme border border-border-theme mt-3`}
        >
          ยกเลิก
        </button>
      </div>
    );
  }

  if (currentStep === 'paymentSuccess') {
    return (
      <div className="p-4 sm:p-6 bg-card-bg-theme text-text-theme rounded-xl shadow-card-theme border border-border-theme max-w-md mx-auto text-center font-main">
        <h2 className="text-2xl sm:text-3xl font-semibold text-success-theme mb-6 font-heading">ชำระเงินสำเร็จ!</h2>
        <p className="text-lg text-text-theme mb-8">การชำระเงินสำหรับโต๊ะ {selectedTable} เรียบร้อยแล้ว ขอบคุณที่ใช้บริการ!</p>
        <button
          onClick={resetAndGoToTableSelection}
          className={`${themedButtonBase} bg-accent-theme hover:bg-accent-hover-theme text-button-text-theme mb-3`}
        >
          ทำรายการใหม่
        </button>
        <button
          onClick={onNavigateBack}
          className={`${themedButtonBase} bg-card-bg-theme text-text-muted-theme hover:bg-border-theme hover:text-text-theme border border-border-theme`}
        >
          ปิด
        </button>
      </div>
    );
  }

  return null; 
};

export default BillView;