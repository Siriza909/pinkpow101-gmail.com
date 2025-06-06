import React from 'react';
import { FoodItem } from '../types';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { MinusCircleIcon } from './icons/MinusCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface FoodItemCardProps {
  item: FoodItem;
  onAddToCart: (item: FoodItem) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  cartQuantity: number;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({ item, onAddToCart, onUpdateQuantity, cartQuantity }) => {
  
  const handleIncrease = () => {
    onAddToCart(item);
  };

  const handleDecrease = () => {
    if (cartQuantity > 0) {
      onUpdateQuantity(item.id, cartQuantity - 1);
    }
  };

  const handleClearQuantity = () => {
    if (cartQuantity > 0) {
      onUpdateQuantity(item.id, 0);
    }
  };

  const actionButtonBase = "p-2.5 rounded-full transition-all duration-200 ease-in-out transform hover:scale-110 focus:outline-none shadow-button-theme disabled:opacity-50 disabled:cursor-not-allowed";
  const plusMinusButtonClass = `${actionButtonBase} bg-accent-theme text-button-text-theme hover:bg-accent-hover-theme`;
  const clearButtonClass = `${actionButtonBase} bg-card-bg-theme text-text-muted-theme hover:bg-border-theme border border-border-theme`;
  const iconSize = "w-9 h-9 sm:w-10 sm:h-10"; 

  return (
    <div className="bg-card-bg-theme text-text-theme rounded-xl border border-border-theme shadow-card-theme p-5 flex flex-col justify-between hover:shadow-card-hover-theme transition-shadow duration-300 font-main">
      <div className="flex-grow">
        <h3 className="text-2xl sm:text-3xl font-semibold mb-3 tracking-tight text-text-theme text-center font-heading">
          {item.name}
        </h3>
        
        <div className="flex items-center justify-around my-4">
          <button
            onClick={handleDecrease}
            disabled={cartQuantity === 0}
            className={plusMinusButtonClass}
            aria-label={`ลดจำนวน ${item.name}`}
          >
            <MinusCircleIcon className={iconSize} />
          </button>

          <div className="relative mx-2">
            <img 
              className="w-36 h-36 sm:w-40 sm:h-40 object-cover rounded-lg shadow-md border border-border-theme"
              src={item.imageUrl} 
              alt={item.name} 
              loading="lazy" 
            />
          </div>
          
          <button
            onClick={handleIncrease}
            className={plusMinusButtonClass}
            aria-label={`เพิ่ม ${item.name} ลงในตะกร้า`}
          >
            <PlusCircleIcon className={iconSize} />
          </button>
        </div>

        {cartQuantity > 0 && (
          <div className="flex items-center justify-center space-x-3 my-3">
            <span className="text-xl sm:text-2xl font-medium text-text-theme">
              จำนวน: {cartQuantity}
            </span>
            <button
              onClick={handleClearQuantity}
              className={clearButtonClass}
              aria-label={`ล้างจำนวน ${item.name}`}
              title="ล้างจำนวน"
            >
              <XCircleIcon className="w-7 h-7 sm:w-8 sm:h-8" />
            </button>
          </div>
        )}
      </div>
      
      <div className="text-center mt-3 pt-3 border-t border-border-theme">
        <span className="text-accent-theme font-bold text-3xl sm:text-4xl select-none">
          ฿{item.price.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default FoodItemCard;