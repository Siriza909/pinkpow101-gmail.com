import React from 'react';
import { AppView } from '../types';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { HomeIcon } from './icons/HomeIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { SimpleCogIcon as CogIcon } from './icons/CogIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';
import { ClipboardDocumentListIcon } from './icons/ClipboardDocumentListIcon'; 
import { ChartBarIcon } from './icons/ChartBarIcon'; 
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { useTheme } from '../contexts/ThemeContext';
import { TableCellsIcon } from './icons/TableCellsIcon'; // New icon for Table Selection
import { BookOpenIcon } from './icons/BookOpenIcon'; // New icon for Food Menu

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  currentView: AppView;
  onSetView: (view: AppView) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  foodCategories: string[];
  tableNumber: string; 
  onSetTableNumber: (tableNum: string) => void; 
}

const Header: React.FC<HeaderProps> = ({
  cartItemCount,
  onCartClick,
  currentView,
  onSetView,
  selectedCategory,
  onSelectCategory,
  foodCategories,
  tableNumber, 
  onSetTableNumber, 
}) => {
  const { theme, toggleTheme } = useTheme();

  const mainNavItems = [
    { name: 'เลือกโต๊ะ', view: AppView.TABLE_SELECTION, icon: TableCellsIcon }, 
    { name: 'เมนูสั่งอาหาร', view: AppView.MENU, icon: BookOpenIcon },
    { name: 'คิดเงิน/ใบเสร็จ', view: AppView.BILL_CHECKOUT, icon: CurrencyDollarIcon }, 
    { name: 'บันทึกรายจ่าย', view: AppView.EXPENSE_LOG, icon: ClipboardDocumentListIcon }, 
    { name: 'สรุปยอด', view: AppView.SUMMARY_REPORT, icon: ChartBarIcon }, 
    { name: 'แอดมิน', view: AppView.ADMIN, icon: ShieldCheckIcon },
    { name: 'ตั้งค่า', view: AppView.SETTINGS, icon: CogIcon },
  ];
  
  const baseNavButton = "flex items-center justify-center sm:justify-start text-center sm:text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 ease-in-out shadow-button-theme text-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg-theme focus:ring-accent-theme/80";
  const activeNavButton = "bg-accent-theme text-button-text-theme scale-105";
  const inactiveNavButton = "bg-card-bg-theme text-text-theme hover:bg-accent-hover-theme hover:text-button-text-theme";

  const categoryButtonBase = "px-5 py-2.5 rounded-full font-semibold text-lg transition-colors duration-200 ease-in-out shadow-button-theme hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg-theme focus:ring-accent-theme/80";
  const activeCategoryButton = "bg-accent-theme text-button-text-theme";
  const inactiveCategoryButton = "bg-card-bg-theme text-text-theme hover:bg-accent-hover-theme hover:text-button-text-theme border border-border-theme";

  return (
    <header className="sticky top-0 z-50 bg-bg-theme/80 backdrop-blur-lg shadow-xl font-main">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-accent-theme font-heading select-none cursor-pointer mb-4 sm:mb-0" onClick={() => onSetView(AppView.TABLE_SELECTION)}>
            สนามรินน้ำ
          </h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className={`${baseNavButton} ${inactiveNavButton} p-3`}
              aria-label={theme === 'light' ? 'เปลี่ยนเป็นธีมมืด' : 'เปลี่ยนเป็นธีมสว่าง'}
            >
              {theme === 'light' ? <MoonIcon className="w-7 h-7" /> : <SunIcon className="w-7 h-7" />}
            </button>
            <button
              onClick={onCartClick}
              className={`${baseNavButton} ${inactiveNavButton} relative p-3`}
              aria-label="ตรวจสอบอาหารที่สั่ง"
            >
              <ShoppingCartIcon className="w-7 h-7" /> 
              <span className="sr-only">ตะกร้า</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-error-theme text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center"> 
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-4">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.view && currentView === item.view;
            return (
              <button
                key={item.name}
                onClick={() => {
                  if (item.view) onSetView(item.view);
                }}
                className={`${baseNavButton} ${isActive ? activeNavButton : inactiveNavButton} flex-col sm:flex-row`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-6 h-6 mb-1 sm:mb-0 sm:mr-2" /> 
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {currentView === AppView.MENU && (
        <div className="bg-card-bg-theme/70 py-4 shadow-inner backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="mb-5 flex flex-col sm:flex-row items-center justify-center gap-3"> 
                  <label htmlFor="headerTableNumber" className="block text-xl font-semibold text-text-theme select-none">
                    หมายเลขโต๊ะ (สำหรับสั่งอาหาร):
                  </label>
                  <input
                    type="text"
                    id="headerTableNumber"
                    value={tableNumber}
                    onChange={(e) => onSetTableNumber(e.target.value)}
                    className="rounded-lg px-4 py-2.5 text-input-text-theme bg-input-bg-theme border border-input-border-theme focus:ring-2 focus:ring-accent-theme focus:border-accent-theme text-xl shadow-inner w-full sm:w-auto max-w-xs text-center"
                    placeholder="กรอกเลขโต๊ะ"
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                    {foodCategories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onSelectCategory(category)}
                        className={`${categoryButtonBase} ${selectedCategory === category ? activeCategoryButton : inactiveCategoryButton}`}
                    >
                        {category}
                    </button>
                    ))}
                </div>
            </div>
        </div>
      )}
    </header>
  );
};

export default Header;