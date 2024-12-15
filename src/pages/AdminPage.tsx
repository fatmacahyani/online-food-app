// AdminPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  order_id: number;
  user_id: number;
  order_date: string;
  status: number;
}

const AdminPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();


  const handleStatusChange = (orderId: number, newStatus: number) => {
    axios
      .put(`${API_URL}/order/${orderId}/status`, { order_status: newStatus })
      .then((response) => {
        if (response.data.success) {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.order_id === orderId ? { ...order, status: newStatus } : order
            )
          );
        } else {
          console.error("Failed to update status.");
        }
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/order`)
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

  const goToDetailPage = (orderId: number) => {
    navigate(`/detail/${orderId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Admin Order Management</h1>
      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <table className="w-full text-center border-collapse mb-6">
          <thead>
            <tr>
              <th className="border-b p-4 border-gray-200 bg-gray-100">Order ID</th>
              <th className="border-b p-4 border-gray-200 bg-gray-100">User ID</th>
              <th className="border-b p-4 border-gray-200 bg-gray-100">Order Date</th>
              <th className="border-b p-4 border-gray-200 bg-gray-100">Status</th>
              <th className="border-b p-4 border-gray-200 bg-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              return (
                <tr key={order.order_id}>
                  <td className="border-b p-4">{order.order_id}</td>
                  <td className="border-b p-4">{order.user_id}</td>
                  <td className="border-b p-4">
                    {new Date(order.order_date).toLocaleString()}
                  </td>
                  <td className="border-b p-4">
                    <div className="flex justify-center">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.order_id, parseInt(e.target.value))}
                        className="px-2 py-1 rounded border"
                      >
                        <option value={1} className="bg-blue-100">Pending</option>
                        <option value={2} className="bg-yellow-100">Processing</option>
                        <option value={3} className="bg-green-100">Delivering</option>
                        <option value={4} className="bg-red-100">Cancelled</option>
                      </select>
                    </div>
                  </td>
                  <td className="border-b p-4">
                    <button
                      onClick={() => goToDetailPage(order.order_id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      View Details
                    </button>
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

export default AdminPage;