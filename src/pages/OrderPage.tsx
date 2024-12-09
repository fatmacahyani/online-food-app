import React, { useEffect, useState } from "react";
import axios from "axios";

interface OrderItem {
  order_id: number;
  order_date: string;
  status: string;
}

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const USER_ID = import.meta.env.VITE_ID_USER;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/order/?user_id=${USER_ID}`)
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">My Orders</h1>
      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">You have no orders.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-4 text-left">Order ID</th>
              <th className="border p-4 text-left">Order Date</th>
              <th className="border p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td className="border p-4">{order.order_id}</td>
                <td className="border p-4">{new Date(order.order_date).toLocaleDateString()}</td>
                <td className="border p-4">
                  <span
                    className={`px-2 py-1 rounded ${
                      order.status === "Delivered"
                        ? "bg-green-500 text-white"
                        : order.status === "Processing"
                        ? "bg-yellow-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderPage;
