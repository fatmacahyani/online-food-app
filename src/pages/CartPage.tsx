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
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);


  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const USER_ID = import.meta.env.VITE_ID_USER;

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/cart/${USER_ID}`)
      .then((response) => {
        if (response.data.data) {
          setCartItems(response.data.data);
          calculateTotal(response.data.data);
          setError(null); // Reset error state jika berhasil
        } else {
          setError("Lakukan login terlebih dahulu.");
        }
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
        if (error.response?.status === 404) {
          setError("Lakukan login terlebih dahulu.");
        } else {
          setError("Terjadi kesalahan, coba lagi.");
        }
      });
  }, [update]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("IDR", "Rp");
  };

  const calculateTotal = (items: CartItem[]) => {
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(totalAmount);
  };

  const updateQuantity = (cart_id: number, value: number) => {
    if (!USER_ID) {
      setError("Lakukan login terlebih dahulu.");
      return;
    }

    if (value === 0) {
      deleteItem(cart_id);
    } else {
      axios
        .put(`${API_URL}/cart/${cart_id}`, { quantity: value })
        .then(() => {
          setUpdate(!update);
          setError(null);
          triggerNotification("Successfully updated!");
        })
        .catch((error) => {
          console.error("Error updating quantity:", error);
          if (error.response?.status === 403) {
            setError("Lakukan login terlebih dahulu.");
          }
        });
    }
  };

  const deleteItem = (cart_id: number) => {
    axios
      .delete(`${API_URL}/cart/${cart_id}`)
      .then(() => {
        setUpdate(!update);
        console.log(`Item with cart_id ${cart_id} removed.`);
      })
      .catch((error) => {
        console.error("Error removing item from cart:", error);
      });
  };

  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 1000); // Notification disappears after 3 seconds
  };

  const goToOrderConfirmation = () => {
    navigate("/orderconfirm");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-7">My Cart</h1>
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-center">
          {error}
        </div>
      )}
      {notification && (
        <div className="bg-green-100 text-green-700 px-4 py-3 rounded mb-4 text-center">
          {notification}
        </div>
      )}
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div>
          <table className="w-full border-collapse mb-6">
            <thead>
              <tr>
                <th className="border-b p-4 border-gray-200 bg-gray-100 text-center">Product</th>
                <th className="border-b p-4 border-gray-200 bg-gray-100 text-center">Quantity</th>
                <th className="border-b p-4 border-gray-200 bg-gray-100 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.cart_id} className="bg-white border-b">
                  <td className="border-b p-4">
                    <div className="flex items-center space-x-4">
                      {/* <img
                        src={`/imagePath/${item.menu_name.toLowerCase().replace(/ /g, "-")}.jpg`}
                        alt={item.menu_name}
                        className="w-16 h-16 object-cover rounded"
                      /> */}
                      <div>
                        <p className="font-bold">{item.menu_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="border p-4">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => updateQuantity(item.cart_id, item.quantity - 1)}
                        className={`px-4 py-2 rounded mr-2 ${
                         item.quantity > 1
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    -
                  </button>
                  <span className="mx-4">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.cart_id, item.quantity + 1)}
                    className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                  >
                    +
                  </button>
                  </div>
                </td>
                  <td className="border-b p-4 text-right">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-bold">Sub Total:</p>
            <p>{formatPrice(total)}</p>
          </div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-bold">Delivery Charge:</p>
            <p>{formatPrice(10000)}</p>
          </div>
          <div className="flex justify-between items-center mb-8">
            <p className="text-xl font-bold">Total:</p>
            <p className="text-xl font-bold text-black">
              {formatPrice(total + 10000)}
            </p>
          </div>
          <div className="flex items-center justify-end">
            <button
              onClick={goToOrderConfirmation}
              className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
