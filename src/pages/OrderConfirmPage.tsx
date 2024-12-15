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
  const [subtotal, setSubtotal] = useState<number>(0);
  const [deliveryCharge] = useState<number>(10000);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const USER_ID = import.meta.env.VITE_ID_USER;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/cart/${USER_ID}`)
      .then((response) => {
        console.log("Order items:", response.data.data);
        setOrderItems(response.data.data);
        calculateSubtotal(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching order data:", error);
      });

    setAddress(" ");
  }, []);

  const calculateSubtotal = (items: OrderItem[]) => {
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setSubtotal(totalAmount);
  };

  const formatPrice = (price: number): string => {
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  const handlePlaceOrder = () => {
    if (address.trim() === "") {
      alert("Please enter your delivery address.");
      return;
    }

    setError(null);
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
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Delivery Address</h2>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          rows={3}
          placeholder="Enter your delivery address"
        ></textarea>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Order Summary</h2>
        <ul className="space-y-3 border-t border-b py-3">
          {orderItems.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b pb-3 last:border-none"
            >
              <div>
                <p className="font-bold text-sm">{item.menu_name}</p>
                <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">{formatPrice(item.price)}</p>
                <p className="text-green-600 font-bold text-sm">
                  {formatPrice(item.total)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <div className="flex justify-between">
            <p className="text-base font-bold">Sub total</p>
            <p className="text-base font-bold">{formatPrice(subtotal)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-base font-bold">Delivery Charge</p>
            <p className="text-base font-bold">{formatPrice(deliveryCharge)}</p>
          </div>
          <div className="flex justify-between border-t mt-2 pt-2">
            <p className="text-lg font-bold">Total</p>
            <p className="text-lg font-bold text-green-600">
              {formatPrice(subtotal + deliveryCharge)}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Payment Method</h2>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center bg-gray-100 space-x-2 border p-4 rounded shadow-sm cursor-pointer hover:shadow-md">
           <input
              type="radio"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={() => setPaymentMethod("cash")}
              className="accent-gray-600"
            />
            <span className="font-medium">Cash</span>
          </label>
          <label className="flex items-center bg-gray-100 space-x-2 border p-5 rounded shadow-sm cursor-pointer hover:shadow-md">
            <input
              type="radio"
              value="bank"
              checked={paymentMethod === "bank"}
              onChange={() => setPaymentMethod("bank")}
              className="accent-gray-600"
            />
            <span className="font-medium">Transfer Bank</span>
          </label>
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={handlePlaceOrder}
          className="flex w-full items-center justify-center rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white hover:bg-green-500"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmPage;
