import React from 'react';
import { CartItem } from '../types'; 
import { HeroTrashIcon as TrashIcon } from './icons/TrashIcon';
import { XMarkIcon } from './icons/XMarkIcon';

interface CartViewProps {
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  tableNumber: string;
  onSetTableNumber: (tableNum: string) => void;
}

const CartView: React.FC<CartViewProps> = ({
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  tableNumber,
  onSetTableNumber
}) => {
  const totalPrice = items.reduce((sum, item) => sum + item.foodItem.price * item.quantity, 0);

  const foodCategories = ['อาหาร', 'อาหารจานร้อน', 'โปรโมชั่น'];
  const drinkCategory = 'เครื่องดื่ม';

  const foodCartItems = items.filter(item => foodCategories.includes(item.foodItem.category));
  const drinkCartItems = items.filter(item => item.foodItem.category === drinkCategory);

  const renderCartItemList = (list: CartItem[], title: string) => (
    <div className="mb-6 font-main">
      <h3 className="text-2xl sm:text-3xl font-semibold text-text-theme mb-4 font-heading">{title}</h3>
      {list.length === 0 ? (
        <p className="text-center text-text-muted-theme py-4 text-lg">ไม่มี{title}ในตะกร้า</p>
      ) : (
        <div className="space-y-4">
          {list.map(cartItem => (
            <div key={cartItem.foodItem.id} className="flex items-center justify-between p-3 bg-bg-theme rounded-lg border border-border-theme">
              <div className="flex items-center">
                <img src={cartItem.foodItem.imageUrl} alt={cartItem.foodItem.name} className="w-20 h-20 object-cover rounded-md mr-4 border border-border-theme"/>
                <div>
                  <h3 className="font-semibold text-lg text-text-theme">{cartItem.foodItem.name}</h3>
                  <p className="text-md text-text-muted-theme">฿{cartItem.foodItem.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="1"
                  value={cartItem.quantity}
                  onChange={(e) => onUpdateQuantity(cartItem.foodItem.id, parseInt(e.target.value))}
                  className="w-20 p-2 border border-input-border-theme rounded-md text-center bg-input-bg-theme text-input-text-theme focus:ring-accent-theme focus:border-accent-theme text-md"
                  aria-label={`จำนวนสำหรับ ${cartItem.foodItem.name}`}
                />
                <button onClick={() => onRemoveItem(cartItem.foodItem.id)} className="text-error-theme hover:opacity-75 p-1.5 transform hover:scale-110 transition-transform" aria-label={`ลบ ${cartItem.foodItem.name}`}>
                  <TrashIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[100] p-4 font-main">
      <div className="bg-card-bg-theme text-text-theme p-5 sm:p-6 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-border-theme">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-border-theme">
          <h2 className="text-3xl sm:text-4xl font-semibold text-text-theme font-heading">ตะกร้าของคุณ</h2>
          <button onClick={onClose} className="text-text-muted-theme hover:text-text-theme transform hover:scale-125 transition-transform p-1" aria-label="ปิดตะกร้า">
            <XMarkIcon className="w-8 h-8" />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-center text-text-muted-theme py-10 text-xl">ตะกร้าของคุณว่างเปล่า</p>
        ) : (
          <div className="overflow-y-auto flex-grow mb-4 pr-1.5 -mr-1.5 max-h-[calc(90vh-280px)]">
            <div className="md:flex md:space-x-4">
              <div className="md:w-1/2">
                {renderCartItemList(foodCartItems, "รายการอาหาร")}
              </div>
              <div className="md:w-1/2 mt-5 md:mt-0">
                {renderCartItemList(drinkCartItems, "เครื่องดื่ม")}
              </div>
            </div>
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-auto pt-5 border-t border-border-theme">
             <div className="mb-5">
              <label htmlFor="tableNumberCart" className="block text-lg font-medium text-text-theme mb-1.5">หมายเลขโต๊ะ:</label>
              <input
                type="text"
                id="tableNumberCart"
                value={tableNumber}
                onChange={(e) => onSetTableNumber(e.target.value)}
                className="w-full p-3 border border-input-border-theme rounded-lg bg-input-bg-theme text-input-text-theme focus:ring-accent-theme focus:border-accent-theme text-lg"
                placeholder="กรอกหมายเลขโต๊ะของคุณ"
                required
              />
            </div>
            <div className="flex justify-between items-center text-2xl sm:text-3xl font-semibold mb-6">
              <span className="text-text-theme">ยอดรวม:</span>
              <span className="text-accent-theme">฿{totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={onCheckout}
              disabled={!tableNumber.trim()}
              className="w-full bg-accent-theme text-button-text-theme py-3.5 px-5 rounded-lg font-semibold hover:bg-accent-hover-theme transition-colors duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed text-xl shadow-button-theme"
            >
              ยืนยันคำสั่งซื้อ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartView;