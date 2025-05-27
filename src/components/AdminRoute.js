import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../api";

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const verificarAdmin = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        setIsAdmin(false);
        return;
      }

      try {
        const res = await API.get("me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsAdmin(res.data.is_superuser); // asegúrate de incluir esto en el endpoint /me/
      } catch (error) {
        setIsAdmin(false);
      }
    };

    verificarAdmin();
  }, []);

  if (isAdmin === null) return <p>Cargando...</p>;
  if (isAdmin === false) return <Navigate to="/atenciones" />;

  return children;
};

export default AdminRoute;
