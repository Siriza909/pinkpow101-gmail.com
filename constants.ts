import { FoodItem } from './types';

export const INITIAL_FOOD_ITEMS: FoodItem[] = [
  {
    id: '1',
    name: 'ผัดกะเพราไก่',
    description: 'ผัดกะเพราไก่รสชาติต้นตำรับ ใส่ใบกะเพรา พริก และกระเทียม เสิร์ฟพร้อมข้าวสวยหอมมะลิ',
    price: 15.99,
    imageUrl: 'https://picsum.photos/seed/thaibasil/400/300',
    category: 'อาหารจานร้อน', // Updated
  },
  {
    id: '2',
    name: 'แกงเขียวหวานกุ้ง',
    description: 'แกงเขียวหวานรสชาติกลมกล่อม ใส่กุ้งสด หน่อไม้ พริกหยวก และมะเขือพวง',
    price: 17.50,
    imageUrl: 'https://picsum.photos/seed/greencurry/400/300',
    category: 'อาหารจานร้อน', // Updated
  },
  {
    id: '3',
    name: 'ผัดไทย',
    description: 'ผัดไทยเส้นจันท์รสเด็ด ใส่เต้าหู้ กุ้ง ถั่วลิสง ถั่วงอก และซอสมะขามรสเปรี้ยวหวาน',
    price: 14.00,
    imageUrl: 'https://picsum.photos/seed/padthai/400/300',
    category: 'อาหารจานร้อน', // Updated
  },
  {
    id: '4',
    name: 'ต้มยำกุ้ง',
    description: 'ต้มยำรสชาติจัดจ้าน หอมกลิ่นตะไคร้ ข่า ใบมะกรูด เห็ด และเลือกเนื้อสัตว์ได้',
    price: 8.99,
    imageUrl: 'https://picsum.photos/seed/tomyum/400/300',
    category: 'อาหารจานร้อน', // Updated (was อาหารเรียกน้ำย่อย)
  },
  {
    id: '5',
    name: 'ข้าวเหนียวมะม่วง',
    description: 'ข้าวเหนียวมูนหวานมัน ราดด้วยน้ำกะทิเข้มข้น เสิร์ฟพร้อมมะม่วงสุกหวานฉ่ำ',
    price: 7.50,
    imageUrl: 'https://picsum.photos/seed/mangosticky/400/300',
    category: 'อาหาร', // Updated (was ของหวาน, 'อาหาร' is the closest from the new list)
  },
  {
    id: '6',
    name: 'ชาไทยเย็น',
    description: 'ชาดำรสเข้ม ชงหวานมันด้วยนมข้นหวาน เสิร์ฟเย็นชื่นใจ',
    price: 4.50,
    imageUrl: 'https://picsum.photos/seed/thaiicedtea/400/300',
    category: 'เครื่องดื่ม', // Stays the same
  },
  {
    id: '7',
    name: 'ปอเปี๊ยะทอด (มังสวิรัติ)',
    description: 'ปอเปี๊ยะมังสวิรัติทอดกรอบ เสิร์ฟพร้อมน้ำจิ้มบ๊วยหวาน',
    price: 6.99,
    imageUrl: 'https://picsum.photos/seed/springrolls/400/300',
    category: 'อาหาร', // Updated (was อาหารเรียกน้ำย่อย)
  },
  {
    id: '8',
    name: 'ข้าวผัดสับปะรด',
    description: 'ข้าวผัดรสเลิศ ใส่ไก่ กุ้ง สับปะรด เม็ดมะม่วงหิมพานต์ ลูกเกด และผงกะหรี่ เสิร์ฟในลูกสับปะรด',
    price: 16.50,
    imageUrl: 'https://picsum.photos/seed/pineapplerice/400/300',
    category: 'อาหารจานร้อน', // Updated
  },
];

export const FOOD_CATEGORIES: string[] = ['ทั้งหมด', 'โปรโมชั่น', 'อาหาร', 'อาหารจานร้อน', 'เครื่องดื่ม'];

export const GEMINI_API_KEY_INFO = "หมายเหตุ: ระบบคาดหวังว่าคีย์ Gemini API จะถูกตั้งค่าในตัวแปรสภาพแวดล้อม `process.env.API_KEY` หากไม่ได้ตั้งค่าไว้ ฟีเจอร์เชฟ AI จะไม่สามารถทำงานได้";