import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/Layout";

const MenuPage = lazy(() => import("@/pages/MenuPage"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const OrderPage = lazy(() => import("@/pages/OrderPage"));
const OrderConfirmPage = lazy(() => import("@/pages/OrderConfirmPage"));

const Loading: React.FC = () => (
  <div className="flex justify-center items-center h-screen">
    <p className="text-xl font-semibold">Loading...</p>
  </div>
);


const routes = [
  {
    path: "/",
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <MenuPage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/cart",
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <CartPage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/order",
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <OrderPage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/orderconfirm",
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <OrderConfirmPage />
        </Suspense>
      </Layout>
    ),
  },
];

export const router = createBrowserRouter(routes);
