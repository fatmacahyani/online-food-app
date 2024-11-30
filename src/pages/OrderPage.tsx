import React, { useEffect, useState } from "react";
import axios from "axios";

interface MenuItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  menuItems: MenuItem[];
  totalPrice: number;
  address: string;
  paymentMethod: string;
}

const OrderPage: React.FC = () => {
  const [orderData, setOrderData] = useState<Order[]>([]);
  const [address, setAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/order/")
      .then((response) => {
        setOrderData(response.data);
        if (response.data.length > 0) {
          setAddress(response.data[0].address || "");
          setPaymentMethod(response.data[0].paymentMethod || "");
        }
      })
      .catch((error) => {
        console.error("Error fetching order data:", error);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
      <div className="mb-6">
        <label className="block font-semibold mb-2">Delivery Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Order Summary</h2>
        {orderData?.map((order) => (
          <div key={order.id} className="mb-4">
            {order.menuItems.map((item, index) => (
              <div key={index} className="flex justify-between mb-2">
                <span>{item.name} (x{item.quantity})</span>
                <span>Rp {item.price.toLocaleString()}</span>
              </div>
            ))}
            <p className="font-bold mt-2">
              Total: Rp {order.totalPrice.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-2">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        >
          <option value="Credit Card">Credit Card</option>
          <option value="PayPal">PayPal</option>
          <option value="Cash on Delivery">Cash on Delivery</option>
        </select>
      </div>

      <button className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600">
        Order
      </button>
    </div>
  );
};

export default OrderPage;
