"use client";
"use client";
import { createContext, useContext, useReducer, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_CART":
      return { ...state, items: action.payload };
    case "ADD_TO_CART": {
      const { product, quantity, size } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product._id === product._id && item.size === size
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item === existingItem
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return { ...state, items: [...state.items, { product, quantity, size }] };
    }
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.product._id === action.payload.productId &&
          item.size === action.payload.size
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(
              item.product._id === action.payload.productId &&
              item.size === action.payload.size
            )
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product, quantity = 1, size) => {
    if (!size) {
      toast.error("Please select a size first.");
      return;
    }
    dispatch({ type: "ADD_TO_CART", payload: { product, quantity, size } });
    toast.success(`${product.name} added to cart!`);
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { productId, size, quantity },
      });
    }
  };

  const removeFromCart = (productId, size) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { productId, size } });
    toast.success("Item removed from cart.");
  };

  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const getCartItemCount = () =>
    state.items.reduce((total, item) => total + item.quantity, 0);
  const getCartTotal = () =>
    state.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartItemCount,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
