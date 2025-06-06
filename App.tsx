import React, { useState, useEffect, useCallback } from 'react';
import { FoodItem, CartItem, AppView, NotificationPreferences, Order, Expense, ShiftBill, Table, Reservation, ExpenseCreationData } from './types'; 
import { INITIAL_FOOD_ITEMS, FOOD_CATEGORIES } from './constants';
import Header from './components/Header';
import FoodItemCard from './components/FoodItemCard';
import CartView from './components/CartView';
import GeminiChef from './components/GeminiChef';
import AdminView from './components/admin/AdminView';
import SettingsView from './components/SettingsView';
import BillView from './components/BillView';
import ExpenseLogPage from './components/ExpenseLogPage'; 
import SummaryPage from './components/SummaryPage';
import TableSelectionPage from './components/TableSelectionPage';
import TableBillManagerPage from './components/TableBillManagerPage';
import ReservationForm from './components/ReservationForm';
import { NotificationService } from './services/notificationService';
import usePersistentState from './hooks/usePersistentState'; 
import { createOrder as createOrderService } from './services/orderService'; 
import { useTheme } from './contexts/ThemeContext';

const App: React.FC = () => {
  useTheme(); 

  const [foodItems, setFoodItems] = usePersistentState<FoodItem[]>('foodItems', INITIAL_FOOD_ITEMS);
  const [allOrders, setAllOrders] = usePersistentState<Order[]>('allOrders', []);
  const [expenses, setExpenses] = usePersistentState<Expense[]>('expenses', []); 
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  const [notificationPreferences, setNotificationPreferences] = usePersistentState<NotificationPreferences>(
    'notificationPreferences', 
    { enabled: false, sound: true, vibrate: true }
  );
  
  const initialTables: Table[] = Array.from({ length: 40 }, (_, i) => ({
    id: `t-${i + 1}`,
    number: (i + 1).toString(),
    status: 'available',
  }));
  const [tables, setTables] = usePersistentState<Table[]>('tables', initialTables);
  const [reservations, setReservations] = usePersistentState<Reservation[]>('reservations', []);
  const [selectedTableForManagement, setSelectedTableForManagement] = useState<Table | null>(null);
  const [showReservationFormForTable, setShowReservationFormForTable] = useState<Table | null>(null);

  const [shiftBills, setShiftBills] = usePersistentState<ShiftBill[]>('shiftBills', []);

  const [filteredFoodItems, setFilteredFoodItems] = useState<FoodItem[]>(foodItems);
  const [cartItems, setCartItems] = useState<CartItem[]>([]); 
  const [showCart, setShowCart] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.TABLE_SELECTION);
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [tableNumber, setTableNumber] = useState<string>(''); // For CartView and Menu Page orders

  useEffect(() => {
    if (selectedCategory === 'ทั้งหมด') {
      setFilteredFoodItems(foodItems);
    } else {
      setFilteredFoodItems(foodItems.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, foodItems]);

  useEffect(() => {
    if (notificationPreferences.enabled && typeof Notification !== 'undefined' && Notification.permission === "default") {
        NotificationService.requestPermission().then(permission => {
          if (permission === 'denied') {
            setNotificationPreferences(prev => ({...prev, enabled: false}));
          } else if (permission === 'granted') {
             setNotificationPreferences(prev => ({...prev, enabled: true}));
          }
        });
    }
  }, [notificationPreferences, setNotificationPreferences]);
  
  const handleSetEditingExpense = useCallback((expense: Expense | null) => {
    setEditingExpense(expense);
  }, []);

  const handleSelectTableForManagement = useCallback((table: Table) => {
    setSelectedTableForManagement(table);
    setCurrentView(AppView.TABLE_BILL_MANAGER);
  }, []);

  const handleReserveTableTrigger = useCallback((table: Table) => {
    if (table.status === 'available') {
      setShowReservationFormForTable(table);
    } else {
      setSelectedTableForManagement(table);
      setCurrentView(AppView.TABLE_BILL_MANAGER);
    }
  }, []);
  
  const handleOpenShift = useCallback((tableId: string): ShiftBill | void => {
    const tableToOccupy = tables.find(t => t.id === tableId);
    if (!tableToOccupy) return;

    const existingOpenShiftForTable = shiftBills.find(shift => shift.tableId === tableId && !shift.isClosed);
    if (existingOpenShiftForTable) {
      alert(`โต๊ะ ${tableToOccupy.number} มีรอบบิลที่ยังไม่ปิดอยู่แล้ว`);
      return;
    }
    const newShift: ShiftBill = {
      id: Date.now().toString(),
      tableId: tableId,
      startTime: new Date().toISOString(),
      orders: [],
      expenses: [],
      isClosed: false,
    };
    setShiftBills(prev => [newShift, ...prev]);
    setTables(prevTables => prevTables.map(t => t.id === tableId ? { ...t, status: 'occupied', currentShiftId: newShift.id, currentReservationId: undefined } : t));
    alert(`เริ่มรอบบิลใหม่สำหรับโต๊ะ ${tableToOccupy.number} แล้ว`);
    setSelectedTableForManagement(prev => prev?.id === tableId ? { ...prev, status: 'occupied', currentShiftId: newShift.id, currentReservationId: undefined } : prev);
    return newShift;
  }, [shiftBills, setShiftBills, tables, setTables]);

  const handleCloseShift = useCallback((shiftId: string) => {
    let closedTableId: string | null = null;
    setShiftBills(prevShifts => 
      prevShifts.map(shift => {
        if (shift.id === shiftId && !shift.isClosed) {
          closedTableId = shift.tableId;
          return { ...shift, endTime: new Date().toISOString(), isClosed: true };
        }
        return shift;
      })
    );
    if (closedTableId) {
      const tableIdToUpdate = closedTableId;
      const tableNumberDisplay = tables.find(t => t.id === tableIdToUpdate)?.number || tableIdToUpdate;
      const today = new Date().toISOString().slice(0, 10);
      const activeReservation = reservations.find(r => r.tableId === tableIdToUpdate && r.date === today);
      const newStatus = activeReservation ? 'reserved' : 'available';

      setTables(prevTables => prevTables.map(t => 
        t.id === tableIdToUpdate 
        ? { ...t, status: newStatus, currentShiftId: undefined, currentReservationId: activeReservation ? activeReservation.id : undefined } 
        : t
      ));
       setSelectedTableForManagement(prev => prev?.id === tableIdToUpdate ? { ...prev, status: newStatus, currentShiftId: undefined, currentReservationId: activeReservation ? activeReservation.id : undefined } : prev);
      alert(`ปิดรอบบิลสำหรับโต๊ะ ${tableNumberDisplay} เรียบร้อยแล้ว`);
    }
  }, [setShiftBills, tables, setTables, reservations]);

  const handleReserveTable = useCallback((reservationData: Omit<Reservation, 'id'> & { tableId: string }) => {
    const newReservation: Reservation = {
      id: Date.now().toString(),
      ...reservationData
    };
    setReservations(prev => [newReservation, ...prev]);
    setTables(prevTables => prevTables.map(t => t.id === reservationData.tableId ? {...t, status: 'reserved', currentReservationId: newReservation.id, currentShiftId: undefined } : t));
    const tableNum = tables.find(t => t.id === reservationData.tableId)?.number || reservationData.tableId;
    alert(`จองโต๊ะ ${tableNum} สำหรับคุณ ${reservationData.name} เรียบร้อยแล้ว`);
    setShowReservationFormForTable(null);
  }, [setReservations, tables, setTables]);

  const handleAddToCart = useCallback((item: FoodItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.foodItem.id === item.id);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.foodItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevItems, { foodItem: item, quantity: 1 }];
    });
  }, []);

  const handleUpdateQuantity = useCallback((itemId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems
        .map(cartItem =>
          cartItem.foodItem.id === itemId
            ? { ...cartItem, quantity }
            : cartItem
        )
        .filter(cartItem => cartItem.quantity > 0) 
    );
  }, []);

  const handleRemoveItem = useCallback((itemId: string) => {
    setCartItems(prevItems => prevItems.filter(cartItem => cartItem.foodItem.id !== itemId));
  }, []);

  const handleCheckout = useCallback(() => {
    if (!tableNumber.trim()) {
      alert('กรุณากรอกหมายเลขโต๊ะของคุณก่อนยืนยันคำสั่งซื้อ');
      return;
    }
    
    const tableBeingOrderedFor = tables.find(t => t.number === tableNumber);
    if (!tableBeingOrderedFor) {
      alert(`ไม่พบโต๊ะหมายเลข ${tableNumber}`);
      return;
    }
    
    let openShiftForTable = shiftBills.find(shift => shift.tableId === tableBeingOrderedFor.id && !shift.isClosed);

    if (tableBeingOrderedFor.status === 'available' || (tableBeingOrderedFor.status === 'reserved' && !openShiftForTable) || (tableBeingOrderedFor.status === 'occupied' && !openShiftForTable)) {
        alert(`โต๊ะ ${tableNumber} ยังไม่ได้เปิดรอบบิล หรือรอบบิลที่เปิดอยู่ไม่ถูกต้อง กรุณาเปิดรอบบิลก่อนทำการสั่งอาหาร`);
        // Optionally, automatically open a shift here if business logic allows
        // const newShift = handleOpenShift(tableBeingOrderedFor.id);
        // if (!newShift) return; // Could not open shift
        // openShiftForTable = newShift; 
        return;
    }

    const newOrder = createOrderService(cartItems, tableNumber);
    setAllOrders(prevOrders => [newOrder, ...prevOrders]); 

    if (openShiftForTable) {
      setShiftBills(prevShifts => 
        prevShifts.map(shift => 
          shift.id === openShiftForTable!.id 
            ? { ...shift, orders: [...shift.orders, newOrder] } 
            : shift
        )
      );
    }

    const successMessage = `ยืนยันออเดอร์สำหรับโต๊ะ ${tableNumber} เรียบร้อยแล้ว! ยอดรวม: ${newOrder.totalAmount.toFixed(2)} บาท`;
    alert(successMessage);

    if (notificationPreferences.enabled && typeof Notification !== 'undefined' && Notification.permission === "granted") {
      NotificationService.showNotification("ยืนยันออเดอร์แล้ว!", {
        body: `ออเดอร์สำหรับโต๊ะ ${tableNumber} ยอดรวม: ${newOrder.totalAmount.toFixed(2)} บาท`,
        vibrate: notificationPreferences.vibrate ? [200, 100, 200] : undefined,
      });
      if (notificationPreferences.sound) NotificationService.playSound();
    }
    setCartItems([]);
    setShowCart(false);
  }, [cartItems, tableNumber, notificationPreferences, setAllOrders, tables, shiftBills, setShiftBills, handleOpenShift]); 

  const handleConfirmPaymentForTable = useCallback((tableNumToClear: string) => {
    setAllOrders(prevOrders => prevOrders.filter(order => order.tableNumber !== tableNumToClear));
    alert(`การชำระเงินสำหรับโต๊ะ ${tableNumToClear} ได้รับการยืนยันแล้ว (ล้างออเดอร์ในประวัติรวม)`);
  }, [setAllOrders]);

  const handleUpdateNotificationPreferences = useCallback((prefsToUpdate: Partial<NotificationPreferences>) => {
    NotificationService.updatePreferences(prefsToUpdate, notificationPreferences, setNotificationPreferences);
  }, [notificationPreferences, setNotificationPreferences]);

  const addFoodItem = useCallback((item: Omit<FoodItem, 'id'>) => {
    setFoodItems(prev => [...prev, { ...item, id: Date.now().toString() }]);
  }, [setFoodItems]);

  const updateFoodItem = useCallback((updatedItem: FoodItem) => {
    setFoodItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  }, [setFoodItems]);

  const deleteFoodItem = useCallback((itemId: string) => {
    setFoodItems(prev => prev.filter(item => item.id !== itemId));
  }, [setFoodItems]);

  const addExpense = useCallback((expenseData: ExpenseCreationData, targetTableId?: string) => {
      const newExpense: Expense = {
        id: Date.now().toString(),
        description: expenseData.description,
        amount: expenseData.amount,
        category: expenseData.category,
        paidBy: expenseData.paidBy,
        paymentMethod: expenseData.paymentMethod,
        isPaid: expenseData.isPaid,
        time: expenseData.time,
        timestamp: new Date(`${expenseData.date}T${expenseData.time || '00:00:00'}`).toISOString(),
      };
      setExpenses(prev => [newExpense, ...prev].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())); 

    if (targetTableId) {
      const openShiftForTable = shiftBills.find(shift => shift.tableId === targetTableId && !shift.isClosed);
      if (openShiftForTable) {
        setShiftBills(prevShifts => 
          prevShifts.map(shift => 
            shift.id === openShiftForTable.id 
              ? { ...shift, expenses: [...shift.expenses, newExpense].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) } 
              : shift
          )
        );
        const tableNum = tables.find(t=>t.id === targetTableId)?.number || targetTableId;
        alert(`เพิ่มรายจ่ายสำหรับรอบบิลโต๊ะ ${tableNum} เรียบร้อยแล้ว`);
      } else {
         const tableNum = tables.find(t=>t.id === targetTableId)?.number || targetTableId;
         alert(`ไม่พบรอบบิลที่เปิดอยู่สำหรับโต๊ะ ${tableNum}. รายจ่ายถูกบันทึกในรายการรวมเท่านั้น`);
      }
    }
  }, [setExpenses, shiftBills, setShiftBills, tables]);

  const handleUpdateExpense = useCallback((updatedExpense: Expense) => {
    setExpenses(prevExpenses => 
        prevExpenses.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp)
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    );
    setShiftBills(prevShiftBills => 
      prevShiftBills.map(shift => ({
        ...shift,
        expenses: shift.expenses.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp)
                              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      }))
    );
    setEditingExpense(null);
    alert('อัปเดตรายจ่ายเรียบร้อยแล้ว');
  }, [setExpenses, setShiftBills]);

  const handleDeleteExpense = useCallback((expenseId: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายจ่ายนี้?')) {
      setExpenses(prevExpenses => prevExpenses.filter(exp => exp.id !== expenseId));
      setShiftBills(prevShiftBills => 
        prevShiftBills.map(shift => ({
          ...shift,
          expenses: shift.expenses.filter(exp => exp.id !== expenseId)
        }))
      );
      alert('ลบรายจ่ายเรียบร้อยแล้ว');
    }
  }, [setExpenses, setShiftBills]);

  const renderView = () => {
    switch (currentView) {
      case AppView.TABLE_SELECTION:
        return <TableSelectionPage 
                  tables={tables} 
                  reservations={reservations}
                  onSelectTable={handleSelectTableForManagement} 
                  onReserveTableTrigger={handleReserveTableTrigger}
                />;
      case AppView.TABLE_BILL_MANAGER:
        if (!selectedTableForManagement) {
          setCurrentView(AppView.TABLE_SELECTION); 
          return null;
        }
        return <TableBillManagerPage 
                  table={selectedTableForManagement}
                  shiftBills={shiftBills}
                  onOpenShift={handleOpenShift}
                  onCloseShift={handleCloseShift}
                  onAddExpenseToShift={(expenseData) => addExpense(expenseData, selectedTableForManagement.id)}
                  onNavigateBack={() => {
                    setSelectedTableForManagement(null);
                    setCurrentView(AppView.TABLE_SELECTION);
                  }}
                />;
      case AppView.MENU:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 sm:p-6">
            {filteredFoodItems.map(item => {
              const currentCartItem = cartItems.find(ci => ci.foodItem.id === item.id);
              const cartQuantity = currentCartItem ? currentCartItem.quantity : 0;
              return (
                <FoodItemCard 
                  key={item.id} 
                  item={item} 
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  cartQuantity={cartQuantity}
                />
              );
            })}
          </div>
        );
      case AppView.GEMINI_CHEF: 
        return <GeminiChef />;
      case AppView.ADMIN:
        return <AdminView 
                  foodItems={foodItems} 
                  onAddFoodItem={addFoodItem} 
                  onUpdateFoodItem={updateFoodItem} 
                  onDeleteFoodItem={deleteFoodItem} 
                  foodCategories={FOOD_CATEGORIES.filter(c => c !== 'ทั้งหมด')}
                />;
      case AppView.SETTINGS:
        return <SettingsView 
                notificationPreferences={notificationPreferences} 
                onUpdateNotificationPreferences={handleUpdateNotificationPreferences} 
               />;
      case AppView.BILL_CHECKOUT:
        return <BillView 
                  orders={allOrders}
                  onConfirmPayment={handleConfirmPaymentForTable} 
                  onNavigateBack={() => setCurrentView(AppView.TABLE_SELECTION)} 
                />;
      case AppView.EXPENSE_LOG:
        return <ExpenseLogPage 
                  expenses={expenses} 
                  onAddExpense={(expData) => addExpense(expData)} 
                  editingExpense={editingExpense}
                  onSetEditingExpense={handleSetEditingExpense}
                  onUpdateExpense={handleUpdateExpense}
                  onDeleteExpense={handleDeleteExpense}
                />;
      case AppView.SUMMARY_REPORT:
        return <SummaryPage orders={allOrders} expenses={expenses} shiftBills={shiftBills} />;
      default:
        setCurrentView(AppView.TABLE_SELECTION); 
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg-theme text-text-theme font-main">
      <Header
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setShowCart(true)}
        currentView={currentView}
        onSetView={setCurrentView}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        foodCategories={FOOD_CATEGORIES}
        tableNumber={tableNumber} 
        onSetTableNumber={setTableNumber} 
      />
      <main className="container mx-auto py-6 px-2 sm:px-4">
        {renderView()}
      </main>
      {showCart && (
        <CartView
          items={cartItems}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
          tableNumber={tableNumber}
          onSetTableNumber={setTableNumber}
        />
      )}
      {showReservationFormForTable && (
        <ReservationForm
          table={showReservationFormForTable}
          onReserve={(resData) => {
            handleReserveTable(resData);
          }}
          onCancel={() => setShowReservationFormForTable(null)}
        />
      )}
    </div>
  );
};

export default App;