import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface OrderItem {
  menu_name: string;
  order_id: number;
  price: number;
  quantity: number;
  status: number;
  total_price: number;
  user_id: number;
}

const DetailPage: React.FC = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams<{ id: string }>();
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (id) {
      axios
        .get(`${API_URL}/order/${id}`)
        .then((response) => {
          if (response.data.success) {
            setOrderItems(response.data.order); // response.data.order is an array
          } else {
            console.error("Failed to fetch order details.");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching order details:", error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading order details...</p>;
  }

  if (orderItems.length === 0) {
    return <p className="text-center text-gray-500">Order not found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Order Details</h1>
      <div className="mb-4">
        <p><strong>Order ID:</strong> {orderItems[0].order_id}</p>
        <p><strong>User ID:</strong> {orderItems[0].user_id}</p>
        <p><strong>Status:</strong> {getStatusLabel(orderItems[0].status).label}</p>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-4 text-left">Item</th>
            <th className="border p-4 text-left">Quantity</th>
            <th className="border p-4 text-left">Price</th>
            <th className="border p-4 text-left">Total</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map((item, index) => (
            <tr key={index}>
              <td className="border p-4">{item.menu_name}</td>
              <td className="border p-4">{item.quantity}</td>
              <td className="border p-4">Rp {item.price.toLocaleString()}</td>
              <td className="border p-4">Rp {item.total_price.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Hfunction to get status label and style
const getStatusLabel = (status: number): { label: string } => {
  switch (status) {
    case 1:
      return { label: "Processing" };
    case 2:
      return { label: "Delivered" };
    case 3:
      return { label: "Cancelled" };
    default:
      return { label: "Unknown" };
  }
};

export default DetailPage;
