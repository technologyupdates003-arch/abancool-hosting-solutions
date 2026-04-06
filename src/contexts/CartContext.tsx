import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface CartItem {
  id: string;
  type: 'hosting' | 'domain' | 'addon';
  planId?: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'quarterly' | 'annually' | 'biennial';
  domain?: string;
  features?: string[];
  setupFee?: number;
  renewalPrice?: number;
  category?: string;
  domainOption?: 'existing' | 'new' | 'subdomain';
}

interface CartState {
  items: CartItem[];
  total: number;
  currency: string;
  promoCode?: string;
  discount?: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_ITEM'; payload: { id: string; updates: Partial<CartItem> } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_PROMO'; payload: { code: string; discount: number } }
  | { type: 'REMOVE_PROMO' };

const initialState: CartState = {
  items: [],
  total: 0,
  currency: 'KSh',
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(
        item => item.planId === action.payload.planId && 
                item.billingCycle === action.payload.billingCycle &&
                item.domain === action.payload.domain
      );
      
      let newItems;
      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = [...state.items];
        newItems[existingItemIndex] = action.payload;
      } else {
        // Add new item
        newItems = [...state.items, action.payload];
      }
      
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems, state.discount),
      };

    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        total: calculateTotal(filteredItems, state.discount),
      };

    case 'UPDATE_ITEM':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, ...action.payload.updates }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems, state.discount),
      };

    case 'CLEAR_CART':
      return initialState;

    case 'APPLY_PROMO':
      return {
        ...state,
        promoCode: action.payload.code,
        discount: action.payload.discount,
        total: calculateTotal(state.items, action.payload.discount),
      };

    case 'REMOVE_PROMO':
      return {
        ...state,
        promoCode: undefined,
        discount: undefined,
        total: calculateTotal(state.items),
      };

    default:
      return state;
  }
}

function calculateTotal(items: CartItem[], discount?: number): number {
  const subtotal = items.reduce((sum, item) => {
    return sum + item.price + (item.setupFee || 0);
  }, 0);
  
  if (discount) {
    return subtotal * (1 - discount / 100);
  }
  
  return subtotal;
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  applyPromoCode: (code: string, discount: number) => void;
  removePromoCode: () => void;
  getItemCount: () => number;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('abancool_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        parsedCart.items.forEach((item: CartItem) => {
          dispatch({ type: 'ADD_ITEM', payload: item });
        });
        if (parsedCart.promoCode && parsedCart.discount) {
          dispatch({ 
            type: 'APPLY_PROMO', 
            payload: { code: parsedCart.promoCode, discount: parsedCart.discount } 
          });
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('abancool_cart', JSON.stringify(state));
  }, [state]);

  const addItem = (item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: `${item.planId || item.name}-${item.billingCycle}-${Date.now()}`,
    };
    dispatch({ type: 'ADD_ITEM', payload: newItem });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateItem = (id: string, updates: Partial<CartItem>) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { id, updates } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const applyPromoCode = (code: string, discount: number) => {
    dispatch({ type: 'APPLY_PROMO', payload: { code, discount } });
  };

  const removePromoCode = () => {
    dispatch({ type: 'REMOVE_PROMO' });
  };

  const getItemCount = () => {
    return state.items.length;
  };

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        removeItem,
        updateItem,
        clearCart,
        applyPromoCode,
        removePromoCode,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}