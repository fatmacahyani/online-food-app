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
        return { label: "Pending", style: "bg-blue-500 text-white" };
      case 2:
        return { label: "Processing", style: "bg-yellow-500 text-white" };
      case 3:
        return { label: "Delivering", style: "bg-green-500 text-white" };
      default:
        return { label: "Cancelled", style: "bg-red-500 text-white" };
      // default:
      //   return { label: "Unknown", style: "bg-gray-500 text-white" };
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

  const renderTracking = (status: number) => {
    const steps = [
      "Order Placed",
      "Order Processed",
      "Order Delivered",
      "Order Arrived",
    ];
    const currentStep = status < 4 ? status -1 : null;

    return status === 4 ? (
      <p className="text-red-500 text-center mt-4">Order Cancelled. Tracking Disabled.</p>
    ) : (
      <div className="flex items-center justify-center space-x-8 mt-4">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${
                  currentStep !== null && index <= currentStep ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {index + 1}
              </div>
              <p className="text-sm mt-2">{step}</p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-20 h-1 ${
                  currentStep !== null && index < currentStep ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

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
              <th className="border-b p-4 border-gray-200 bg-gray-100 text-center">
                Order ID
              </th>
              <th className="border-b p-4 border-gray-200 bg-gray-100 text-center">
                Order Date
              </th>
              <th className="border-b p-4 border-gray-200 bg-gray-100 text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const { label, style } = getStatusLabel(order.status);
              return (
                <tr key={order.order_id}>
                  <td className="border-b p-4">{order.order_id}</td>
                  <td className="border-b p-4">
                    {new Date(order.order_date).toLocaleString()}
                  </td>
                  <td className="border-b p-4">
                    <span className={`px-2 py-1 rounded ${style}`}>{label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {!loading &&
        orders.map((order) => (
          <div key={order.order_id} className="mt-8">
            <h2 className="text-lg font-bold">Tracking for Order {order.order_id}</h2>
            {renderTracking(order.status)}
          </div>
        ))}
    </div>
  );
};

export default OrderPage;
