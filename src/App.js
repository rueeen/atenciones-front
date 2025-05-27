import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginForm from "./components/LoginForm";
import AtencionList from "./components/AtencionList";
import AtencionForm from "./components/AtencionForm";
import Perfil from "./components/Perfil";
import CrearUsuarioForm from "./components/CrearUsuarioForm";
import FormularioAtencionWizard from "./components/FormularioAtencionWizard";

import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import AppNavbar from "./components/Navbar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access")
  );

  // Permite que LoginForm informe a App.js del login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {isLoggedIn && <AppNavbar onLogout={handleLogout} />}
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route
            path="/atenciones"
            element={
              <PrivateRoute>
                <AtencionList />
              </PrivateRoute>
            }
          />
          <Route
            path="/nueva-atencion"
            element={
              <PrivateRoute>
                <AtencionForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <Perfil />
              </PrivateRoute>
            }
          />
          <Route
            path="/usuarios/nuevo"
            element={
              <AdminRoute>
                <CrearUsuarioForm />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/atenciones" />} />
          <Route
            path="/atencion/nueva"
            element={
              <PrivateRoute>
                <FormularioAtencionWizard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
