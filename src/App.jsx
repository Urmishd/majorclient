import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Product from "./pages/products/Product";


const ProtectedRoute = ({ children, isLoggedIn }) => {
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

const App = () => {
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem("user", username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setShowDashboard(false);
  };

  return (
    <Router>
      <Header 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout}
        setShowDashboard={setShowDashboard}
      />
      <Routes>
        <Route 
          path="/" 
          element={
            <>
              {/* {showDashboard && <SellerDashboard />} */}
              {!showDashboard && <Home />}
            </>
          } 
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute isLoggedIn={!!user}>
              {/* {showDashboard && <SellerDashboard />} */}
              {!showDashboard && <About />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/product"
          element={
            <ProtectedRoute isLoggedIn={!!user}>
              {/* {showDashboard && <SellerDashboard />} */}
              {!showDashboard && <Product />}
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;