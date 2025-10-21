import { createHashRouter, RouterProvider } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { checkApiStatus } from "services/api.service";
import Home from "./components/pages/Home";
import Layout from "./components/common/layout/Layout";
import Shop from "./components/pages/Shop";

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home />, },
      { path: "/shop", element: <Shop />, },
      { path: "/mercadopago", element: <></>, },
    ]
  }
]);

const App = () => {
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const checkApi = async () => {
      try {
        const data = await checkApiStatus(); 
        console.log("Respuesta de la API:", data.message);
        setApiError(null);
      } catch (error) {
        console.error("Error al conectar con la API:", error);
        setApiError(error.message);
      }
    };

    checkApi();
  }, []);
 

  if (apiError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Error de conexión</h1>
        <p>No se pudo conectar con el servidor (EcoPark). Intenta de nuevo más tarde.</p>
        <pre>{apiError}</pre>
      </div>
    );
  }
  
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
