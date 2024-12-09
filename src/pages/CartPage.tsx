import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface CartItem {
  cart_id: number;
  menu_name: string;
  quantity: number;
  price: number;
  total: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [update, setUpdate] = useState<boolean>(true);

  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const USER_ID = import.meta.env.VITE_ID_USER;

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/cart/${USER_ID}`)
      .then((response) => {
        console.log("Cart items:", response.data.data);
        setCartItems(response.data.data);
        calculateTotal(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
      });
  }, [update]);

  const calculateTotal = (items: CartItem[]) => {
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(totalAmount);
  };

  const updateQuantity = (cart_id: number, value: number) => {
    if (value === 0) {
      axios
        .delete(`${API_URL}/cart/${cart_id}`)
        .then(() => {
          setUpdate(!update);
          console.log(`Item with cart_id ${cart_id} removed.`);
        })
        .catch((error) => {
          console.error("Error removing item from cart:", error);
        });
    } else {
      axios
        .put(`${API_URL}/cart/${cart_id}`, { quantity: value })
        .then(() => {
          setUpdate(!update);
        })
        .catch((error) => {
          console.error("Error updating quantity:", error);
        });
    }
  };

  const goToOrderConfirmation = () => {
    navigate("/orderconfirm");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">My Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-4 text-left">Item</th>
                <th className="border p-4 text-left">Quantity</th>
                <th className="border p-4 text-left">Price</th>
                <th className="border p-4 text-left">Total</th>
                <th className="border p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.cart_id}>
                  <td className="border p-4">{item.menu_name}</td>
                  <td className="border p-4">{item.quantity}</td>
                  <td className="border p-4">Rp {item.price.toFixed(2)}</td>
                  <td className="border p-4">
                    Rp {(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="border p-4 text-center">
                    {item.quantity > 1 ? (
                      <button
                        onClick={() =>
                          updateQuantity(item.cart_id, item.quantity - 1)
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2"
                      >
                        -
                      </button>
                    ) : null}
                    <button
                      onClick={() =>
                        updateQuantity(item.cart_id, item.quantity + 1)
                      }
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      +
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right mt-6">
            <p className="text-xl font-bold">
              Total: <span className="text-green-600">Rp {total.toFixed(2)}</span>
            </p>
          </div>
          <div className="text-center mt-6">
            <button
              onClick={goToOrderConfirmation}
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
            >
              Proceed to Order Confirmation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
