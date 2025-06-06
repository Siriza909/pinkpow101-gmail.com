import React, { useState, useEffect } from 'react';
import { FoodItem } from '../../types';

interface FoodItemFormProps {
  itemToEdit?: FoodItem | null;
  onSubmit: (itemData: Omit<FoodItem, 'id'> | FoodItem) => void;
  onCancel: () => void;
  categories: string[];
}

const FoodItemForm: React.FC<FoodItemFormProps> = ({ itemToEdit, onSubmit, onCancel, categories }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState(categories[0] || '');

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setDescription(itemToEdit.description);
      setPrice(itemToEdit.price.toString());
      setImageUrl(itemToEdit.imageUrl);
      setCategory(itemToEdit.category);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      setCategory(categories[0] || '');
    }
  }, [itemToEdit, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || !category || !imageUrl) {
        alert("กรุณากรอกข้อมูลในทุกช่อง");
        return;
    }
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
        alert("กรุณากรอกราคาที่ถูกต้อง");
        return;
    }

    const itemData = {
      name,
      description,
      price: priceValue,
      imageUrl,
      category,
    };
    
    if (itemToEdit && itemToEdit.id) {
      onSubmit({ ...itemData, id: itemToEdit.id });
    } else {
      onSubmit(itemData);
    }
  };

  const themedInputClass = "mt-1.5 block w-full px-4 py-3 bg-input-bg-theme text-input-text-theme border border-input-border-theme rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-theme focus:border-accent-theme text-lg";
  const themedLabelClass = "block text-lg font-medium text-text-theme";
  const themedButtonBase = "px-6 py-3 rounded-lg font-semibold transition-colors duration-150 ease-in-out transform hover:opacity-90 text-lg shadow-button-theme focus:outline-none focus:ring-2 focus:ring-accent-theme/50";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1 font-main">
       <div className="pb-3 border-b border-border-theme">
          <h3 className="text-2xl sm:text-3xl font-semibold text-text-theme font-heading">
            {itemToEdit ? 'แก้ไขรายการอาหาร' : 'เพิ่มรายการอาหารใหม่'}
          </h3>
      </div>
      <div>
        <label htmlFor="name" className={themedLabelClass}>ชื่ออาหาร:</label>
        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={themedInputClass} required />
      </div>
      <div>
        <label htmlFor="description" className={themedLabelClass}>คำอธิบาย:</label>
        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className={themedInputClass} required />
      </div>
      <div>
        <label htmlFor="price" className={themedLabelClass}>ราคา:</label>
        <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} step="0.01" min="0" className={themedInputClass} required />
      </div>
      <div>
        <label htmlFor="imageUrl" className={themedLabelClass}>URL รูปภาพ:</label>
        <input type="url" id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className={themedInputClass} placeholder="https://example.com/image.jpg" required />
      </div>
      <div>
        <label htmlFor="category" className={themedLabelClass}>ประเภท:</label>
        <select id="category" value={category} onChange={e => setCategory(e.target.value)} className={`${themedInputClass} appearance-none`} required>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-end space-x-4 pt-5">
        <button type="button" onClick={onCancel} className={`${themedButtonBase} bg-card-bg-theme text-text-muted-theme border border-border-theme hover:bg-border-theme hover:text-text-theme`}>
          ยกเลิก
        </button>
        <button type="submit" className={`${themedButtonBase} bg-accent-theme text-button-text-theme hover:bg-accent-hover-theme`}>
          {itemToEdit ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มรายการ'}
        </button>
      </div>
    </form>
  );
};

export default FoodItemForm;