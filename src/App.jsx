import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateTrip from "./components/pages/CreateTrip";
import AuthProvider from "./context/AuthContext";
import Home from "./components/pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
          <ToastContainer position="top-right" autoClose={2000} />

    <AuthProvider>
      <Router>
        <Navbar />

        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/generate"
            element={
              <ProtectedRoute>
                <CreateTrip />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
    </>
  );
}

export default App;