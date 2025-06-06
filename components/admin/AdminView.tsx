import React, { useState, useCallback } from 'react';
import { FoodItem } from '../../types';
import FoodItemForm from './FoodItemForm';
import { PlusIcon } from '../icons/PlusIcon'; 
import { PencilIcon } from '../icons/PencilIcon'; 
import { HeroTrashIcon as TrashIcon } from '../icons/TrashIcon'; 

interface AdminViewProps {
  foodItems: FoodItem[];
  onAddFoodItem: (item: Omit<FoodItem, 'id'>) => void;
  onUpdateFoodItem: (item: FoodItem) => void;
  onDeleteFoodItem: (id: string) => void;
  foodCategories: string[];
}

const AdminView: React.FC<AdminViewProps> = ({ 
  foodItems, 
  onAddFoodItem, 
  onUpdateFoodItem, 
  onDeleteFoodItem, 
  foodCategories
}) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  const handleAddNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = useCallback((id: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) {
      onDeleteFoodItem(id);
    }
  }, [onDeleteFoodItem]);

  const handleFormSubmit = (itemData: Omit<FoodItem, 'id'> | FoodItem) => {
    if ('id' in itemData && itemData.id) { 
      onUpdateFoodItem(itemData as FoodItem);
    } else { 
      onAddFoodItem(itemData as Omit<FoodItem, 'id'>);
    }
    setShowForm(false);
    setEditingItem(null);
  };
  
  const themedButtonBase = "px-6 py-3 rounded-lg font-semibold transition-colors duration-150 ease-in-out transform hover:opacity-90 text-lg sm:text-xl shadow-button-theme focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg-theme focus:ring-accent-theme/80";
  const themedIconButtonClass = "p-3 rounded-lg font-medium transition-colors duration-150 ease-in-out transform hover:scale-110 focus:outline-none";

  return (
    <div className="p-4 sm:p-6 bg-card-bg-theme text-text-theme rounded-xl shadow-card-theme border border-border-theme max-w-5xl mx-auto font-main">
      
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-semibold text-text-theme font-heading">จัดการรายการอาหาร</h2>
        <button
          onClick={handleAddNew}
          className={`${themedButtonBase} bg-accent-theme text-button-text-theme hover:bg-accent-hover-theme flex items-center`}
        >
          <PlusIcon className="w-6 h-6 mr-2" /> เพิ่มรายการใหม่
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
          <div className="bg-card-bg-theme text-text-theme p-5 sm:p-6 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-border-theme">
            <FoodItemForm
              itemToEdit={editingItem}
              onSubmit={handleFormSubmit}
              onCancel={() => { setShowForm(false); setEditingItem(null); }}
              categories={foodCategories}
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-border-theme shadow-md">
        <table className="min-w-full divide-y divide-border-theme">
          <thead className="bg-bg-theme/50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-text-muted-theme uppercase tracking-wider">รูปภาพ</th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-text-muted-theme uppercase tracking-wider">ชื่อ</th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-text-muted-theme uppercase tracking-wider">ประเภท</th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-text-muted-theme uppercase tracking-wider">ราคา</th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-text-muted-theme uppercase tracking-wider">การกระทำ</th>
            </tr>
          </thead>
          <tbody className="bg-card-bg-theme divide-y divide-border-theme">
            {foodItems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-lg text-text-muted-theme">
                  ไม่พบรายการอาหาร เพิ่มรายการเพื่อเริ่มต้น!
                </td>
              </tr>
            )}
            {foodItems.map((item) => (
              <tr key={item.id} className="hover:bg-bg-theme/30 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img src={item.imageUrl || 'https://via.placeholder.com/80x80.png?text=No+Image'} alt={item.name} className="w-16 h-16 object-cover rounded-md border border-border-theme"/>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-lg font-medium text-text-theme">{item.name}</div>
                  <div className="text-sm text-text-muted-theme truncate max-w-xs">{item.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-md text-text-muted-theme">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-md text-text-muted-theme">฿{item.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button 
                    onClick={() => handleEdit(item)} 
                    className={`${themedIconButtonClass} text-accent-theme hover:text-accent-hover-theme`} 
                    aria-label="แก้ไขรายการ">
                    <PencilIcon className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className={`${themedIconButtonClass} text-error-theme hover:opacity-75`} 
                    aria-label="ลบรายการ">
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminView;