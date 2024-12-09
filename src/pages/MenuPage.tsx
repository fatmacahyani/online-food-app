import React, { useEffect, useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import axios from "axios";

interface MenuItem {
  id: number;
  item_name: string;
  description: string;
  price: number;
  imagePath: string;
}

function formatCurrency(price: number | bigint) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

const MenuPage: React.FC = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);

  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const USER_ID = import.meta.env.VITE_ID_USER;

  const addItem = async (menu_id: number) => {
    const requestBody = {
      menu_id,
      quantity: 1,
      user_id: USER_ID,
    };

    try {
      const response = await axios.post(`${API_URL}/cart`, requestBody);
      console.log("Item added to cart:", response.data);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/menu`)
      .then((response) => {
        setMenu(response.data);
      })
      .catch((error) => {
        console.error("Error fetching menu:", error);
      });
  }, [API_URL]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-6">Order Your Favourite Food!</h1>

      <div className="flex justify-center mb-8">
      <img
        src="/imagepage.jpg"
        alt="Main Banner"
        className="object-w-full h-auto max-w-screen-lg rounded-lg shadow-lg"
      />
    </div>

      {menu.length === 0 ? (
        <p className="text-center text-gray-500">Choose Your Favorite Food...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menu.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {item.item_name}
              </h2>
              <div className="gambar">
                <img src={item.imagePath} alt="" />
              </div>
              <p className="text-gray-600 mb-4">{item.description}</p>

              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(item.price)}
                </p>
                <PlusIcon
                  onClick={() => addItem(item.id)}
                  className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full hover:bg-green-600 active:bg-green-700"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
