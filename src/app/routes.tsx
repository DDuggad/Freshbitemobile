import { createBrowserRouter, Navigate } from "react-router";
import { AppProviders } from "./components/AppProviders";
import { Root } from "./components/Root";
import { VendorRoot } from "./components/VendorRoot";
import { VendorAuthLayout } from "./components/VendorAuthLayout";
import { Home } from "./components/Home";
import { Search } from "./components/Search";
import { Favorites } from "./components/Favorites";
import { VendorHub } from "./components/VendorHub";
import { DealDetails } from "./components/DealDetails";
import { VendorLogin } from "./components/VendorLogin";
import { VendorSignup } from "./components/VendorSignup";
import { VendorDashboard } from "./components/VendorDashboard";
import { AddDealPage } from "./components/AddDealPage";
import { VendorProfile } from "./components/VendorProfile";

export const router = createBrowserRouter([
  {
    Component: AppProviders,
    children: [
      {
        path: "/",
        element: <Navigate to="/app" replace />,
      },
      {
        path: "/app",
        Component: Root,
        children: [
          { index: true, Component: Home },
          { path: "search", Component: Search },
          { path: "favorites", Component: Favorites },
          { path: "vendor-hub", Component: VendorHub },
          { path: "deal/:id", Component: DealDetails },
          { path: "deals", element: <Navigate to="/app/search" replace /> },
        ],
      },
      {
        Component: VendorAuthLayout,
        children: [
          { path: "/vendor/login", Component: VendorLogin },
          { path: "/vendor/signup", Component: VendorSignup },
        ],
      },
      {
        path: "/vendor",
        Component: VendorRoot,
        children: [
          { index: true, Component: VendorDashboard },
          { path: "add-deal", Component: AddDealPage },
          { path: "edit-deal/:id", Component: AddDealPage },
          { path: "profile", Component: VendorProfile },
        ],
      },
    ],
  },
]);
