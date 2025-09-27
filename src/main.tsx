import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import LandingPage from "./pages/LandingPage";
import WelcomePage from "./pages/WelcomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import InfoPage from "./pages/InfoPage";
import RooftopArea from "./components/RooftopArea";
import MaterialUpload from "./components/MaterialUpload";
import RainfallInfo from "./components/RainfallInfo";
import WaterFeasibility from "./components/WaterFeasibility";
import SoilAnalysis from "./components/SoilAnalysis";
import Report from "./components/Report";
import Layout from "./components/Layout";
import WaterMap from "./components/WaterMap";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";

import { AuthProvider } from "./context/AuthContext";
import { AppDataProvider } from "./context/AppDataContext";
import { LanguageProvider } from "./context/LanguageContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />,
  },
  {
    path: "/welcome",
    element: <WelcomePage />,
  },
  {
    path: "/auth/login",
    element: <SignInPage />,
  },
  {
    path: "/auth/signup",
    element: <SignUpPage />,
  },
  {
    path: "/login",
    element: <WelcomePage />,
  },
  {
    path: "/dashboard",
    element: <InfoPage />,
  },
  {
    path: "/area",
    element: (
      <Layout>
        <RooftopArea />
      </Layout>
    ),
  },
  {
    path: "/material",
    element: (
      <Layout>
        <MaterialUpload />
      </Layout>
    ),
  },
  {
    path: "/rainfall",
    element: (
      <Layout>
        <RainfallInfo />
      </Layout>
    ),
  },
  {
    path: "/feasibility",
    element: (
      <Layout>
        <WaterFeasibility />
      </Layout>
    ),
  },
  {
    path: "/soil",
    element: (
      <Layout>
        <SoilAnalysis />
      </Layout>
    ),
  },
  {
    path: "/report",
    element: (
      <Layout>
        <Report />
      </Layout>
    ),
  },
  {
    path: "/water-map",
    element: (
      <Layout>
        <WaterMap />
      </Layout>
    ),
  },
  {
    path: "/about",
    element: (
      <Layout>
        <About />
      </Layout>
    ),
  },
  {
    path: "/contact",
    element: (
      <Layout>
        <Contact />
      </Layout>
    ),
  },
  {
    path: "*",
    element: (
      <Layout>
        <LandingPage />
      </Layout>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <AppDataProvider>
          <RouterProvider router={router} />
        </AppDataProvider>
      </AuthProvider>
    </LanguageProvider>
  </React.StrictMode>
);