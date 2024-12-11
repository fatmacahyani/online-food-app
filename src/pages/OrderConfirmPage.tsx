import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  menu_name: string;
  quantity: number;
  price: number;
  total: number;
}

const OrderConfirmPage: React.FC = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [address, setAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [total, setTotal] = useState<number>(0);

  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const USER_ID = import.meta.env.VITE_ID_USER;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/cart/${USER_ID}`)
      .then((response) => {
        console.log("Order items:", response.data.data);
        setOrderItems(response.data.data);
        calculateTotal(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching order data:", error);
      });

    setAddress(" ");
  }, []);

  const calculateTotal = (items: OrderItem[]) => {
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(totalAmount);
  };

  const handlePlaceOrder = () => {
    const orderData = {
      user_id: USER_ID,
      address,
      payment_method: paymentMethod,
      items: orderItems,
    };

    axios
      .post(`${API_URL}/order/`, orderData)
      .then(() => {
        console.log("Order placed successfully.");
        alert("Order placed successfully!");
        navigate("/order"); 
      })
      .catch((error) => {
        console.error("Error placing order:", error);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Order Confirmation</h1>

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Delivery Address</h2>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Order Summary</h2>
        <ul className="space-y-4">
          {orderItems.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b pb-4"
            >
              <div>
                <p className="font-bold">{item.menu_name}</p>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>
              <div>
                <p>Rp {item.price.toFixed(2)}</p>
                <p className="text-green-600 font-bold">
                  Total: Rp {item.total.toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Payment Method</h2>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={() => setPaymentMethod("cash")}
            />
            <span>Cash</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
            />
            <span>Bank Transfer</span>
          </label>
        </div>
      </div>

      <div className="text-right">
        <p className="text-xl font-bold mb-4">
          Total: <span className="text-green-600">Rp {total.toFixed(2)}</span>
        </p>
        <button
          onClick={handlePlaceOrder}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmPage;
