import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader, Plus, Minus, Check, X, ShoppingCart } from 'lucide-react';

const TableOrderPage = () => {
  const { tableNumber } = useParams();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`/api/table/${tableNumber}`);
        const data = await response.json();
        
        if (data.success) {
          setMenuItems(data.menu);
        } else {
          setError("Failed to load menu");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [tableNumber]);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.foodId === item._id);
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.foodId === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, {
          foodId: item._id,
          name: item.name,
          price: item.price,
          quantity: 1
        }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.foodId === itemId);
      
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.foodId === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter(item => item.foodId !== itemId);
      }
    });
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const submitOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      const response = await fetch(`/api/table/${tableNumber}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          customerName,
          specialInstructions
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setOrderNumber(data.orderNumber);
        setOrderSubmitted(true);
        setCart([]);
      } else {
        alert("Failed to submit order. Please try again.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <X className="mx-auto text-red-500" size={48} />
          <h2 className="text-xl font-bold text-red-700 mt-4">Error</h2>
          <p className="text-red-600 mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orderSubmitted) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="text-center bg-green-50 p-6 rounded-lg">
          <Check className="mx-auto text-green-500" size={48} />
          <h2 className="text-2xl font-bold text-green-700 mt-4">Order Submitted!</h2>
          <p className="text-gray-600 mt-2">Your order has been received by the kitchen.</p>
          
          <div className="mt-6 bg-white p-4 rounded border">
            <p className="font-semibold">Table: {tableNumber}</p>
            <p className="font-semibold">Order #: {orderNumber}</p>
          </div>
          
          <button
            onClick={() => setOrderSubmitted(false)}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Table {tableNumber} Order</h1>
      </header>

      <div className="p-4">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name (Optional)</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="John Doe"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <h2 className="text-lg font-semibold mb-3">Menu</h2>
        <div className="space-y-3 mb-8">
          {menuItems.map(item => (
            <div key={item._id} className="flex justify-between items-center p-3 border rounded">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => addToCart(item)}
                className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Plus size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold flex items-center">
              <ShoppingCart className="mr-2" size={18} />
              Your Order ({cart.reduce((total, item) => total + item.quantity, 0)} items)
            </h3>
            <span className="font-bold">${getTotal().toFixed(2)}</span>
          </div>

          {cart.length > 0 && (
            <div className="mb-4 max-h-40 overflow-y-auto">
              {cart.map(item => (
                <div key={item.foodId} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => removeFromCart(item.foodId)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() => addToCart({
                        _id: item.foodId,
                        name: item.name,
                        price: item.price
                      })}
                      className="p-1 text-green-500 hover:text-green-700"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Allergies, preferences, etc."
              className="w-full p-2 border border-gray-300 rounded"
              rows={2}
            />
          </div>

          <button
            onClick={submitOrder}
            disabled={cart.length === 0}
            className={`w-full py-2 rounded font-medium ${cart.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}
          >
            Submit Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableOrderPage;