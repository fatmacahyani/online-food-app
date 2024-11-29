import React, { useEffect, useState } from "react";
import axios from "axios";

interface OrderItem {
  id: number;
  item_name: string;
  quantity: number;
  price: number;
}

interface OrderData {
  address: string;
  items: OrderItem[];
  total_price: number;
}

const OrderPage: React.FC = () => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    // Fetch order data
    axios
      .get(`${API_URL}/order`)
      .then((response) => {
        setOrderData(response.data);
        setAddress(response.data.address); // Initialize editable address
      })
      .catch((error) => {
        console.error("Error fetching order data:", error);
      });
  }, []);

  const handleOrder = () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    const requestData = {
      address,
      payment_method: paymentMethod,
    };

    // Submit the order (assumes a POST endpoint)
    axios
      .post(`${API_URL}/order`, requestData)
      .then((response) => {
        console.log("Order confirmed:", response.data);
        alert("Order placed successfully!");
      })
      .catch((error) => {
        console.error("Error confirming order:", error);
        alert("Failed to place the order.");
      });
  };

  if (!orderData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Order Confirmation</h1>
      
      {/* Editable Address */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Delivery Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
          rows={3}
        />
      </div>

      {/* Order Summary */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <ul className="space-y-4">
          {orderData.items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center p-4 bg-gray-100 rounded-lg"
            >
              <span className="font-semibold">{item.item_name}</span>
              <span>
                {item.quantity} x {formatCurrency(item.price)}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-right text-lg font-bold mt-4">
          Total: {formatCurrency(orderData.total_price)}
        </p>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        >
          <option value="" disabled>Select a payment method</option>
          <option value="credit_card">Credit Card</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="cash_on_delivery">Cash on Delivery</option>
        </select>
      </div>

      {/* Order Button */}
      <button
        onClick={handleOrder}
        className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 active:bg-green-700"
      >
        Order
      </button>
    </div>
  );
};

// Helper function for currency formatting
function formatCurrency(price: number | bigint) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

export default OrderPage;
