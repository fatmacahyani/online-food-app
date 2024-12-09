import React, { useEffect, useState } from "react";
import axios from "axios";

interface OrderItem {
  order_id: number;
  order_date: string;
  status: number;
}

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const USER_ID = import.meta.env.VITE_ID_USER;

  const getStatusLabel = (status: number): { label: string; style: string } => {
    switch (status) {
      case 1:
        return { label: "Processing", style: "bg-yellow-500 text-white" };
      case 2:
        return { label: "Delivered", style: "bg-green-500 text-white" };
      case 3:
        return { label: "Cancelled", style: "bg-red-500 text-white" };
      default:
        return { label: "Unknown", style: "bg-gray-500 text-white" };
    }
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/order`, { params: { user_id: USER_ID } })
      .then((response) => {
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          console.error("Failed to fetch orders.");
        }
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
        <table className="w-full text-center table-auto min-w-max">
          <thead>
            <tr>
              <th className="border-b p-4 border-gray-200 bg-gray-100 text-center">Order ID</th>
              <th className="border-b p-4 border-gray-200 bg-gray-100 text-center">Order Date</th>
              <th className="border-b p-4 border-gray-200 bg-gray-100 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const { label, style } = getStatusLabel(order.status);
              return (
                <tr key={order.order_id}>
                  <td className="border-b p-4">{order.order_id}</td>
                  <td className="border-b p-4">{new Date(order.order_date).toLocaleDateString()}</td>
                  <td className="border-b p-4">
                    <span className={`px-2 py-1 rounded ${style}`}>{label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderPage;
