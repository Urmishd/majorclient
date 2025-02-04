import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Product from "./pages/products/Product";
import PreviewProduct from "./pages/products/PreviewProduct";
import Cart from "./components/Cart";
import CheckoutContainer from "./components/CheckoutContainer";
import PaymentTab from "./components/PaymentTab";

const ProtectedRoute = ({ children, isLoggedIn }) => {
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

const App = () => {
  const [user, setUser] = useState(() => localStorage.getItem("user") || null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  // Initialize notifications state
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const syncUser = () => {
      setUser(localStorage.getItem("user"));
    };

    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const handleLogin = (username) => {
    localStorage.setItem("user", username);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowDashboard(false);
  };

  const addPaymentNotification = (paymentDetails) => {
    console.log("Adding new notification:", paymentDetails);
    const newNotification = {
      id: Date.now(),
      message: `Order #${Math.floor(Math.random() * 10000)} confirmed! Paid via ${paymentDetails.method}`,
      timestamp: new Date().toLocaleString(),
      type: 'payment'
    };

    console.log("Created notification object:", newNotification);
    setNotifications(prevNotifications => {
      const updatedNotifications = [newNotification, ...prevNotifications];
      console.log("Updated notifications array:", updatedNotifications);
      return updatedNotifications;
    });
  };

  return (
    <Router>
      <Header
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        setShowDashboard={setShowDashboard}
        notifications={notifications}  // Make sure this line exists
      />

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <Routes>
        <Route path="/" element={!showDashboard && <Home />} />

       
        <Route
          path="/payment"
          element={
            <ProtectedRoute isLoggedIn={!!user}>
              <PaymentTab
                addPaymentNotification={addPaymentNotification}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute isLoggedIn={!!user}>
              <CheckoutContainer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/about"
          element={
            <ProtectedRoute isLoggedIn={!!user}>
              {!showDashboard && <About />}
            </ProtectedRoute>
          }
        />

        <Route
          path="/product"
          element={
            <ProtectedRoute isLoggedIn={!!user}>
              {!showDashboard && <Product />}
            </ProtectedRoute>
          }
        />

        <Route
          path="/product/preview/:id"
          element={
            <PreviewProduct onOpenCart={() => setIsCartOpen(true)} />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;