// services/orderService.ts
import { CartItem, Order } from '../types';

export function createOrder(cartItems: CartItem[], tableNumber: string): Order {
  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.foodItem.price, 0);
  return {
    id: Date.now().toString(),
    tableNumber,
    items: [...cartItems], // Ensure a new array is created
    totalAmount: total,
    timestamp: new Date().toISOString(),
  };
}