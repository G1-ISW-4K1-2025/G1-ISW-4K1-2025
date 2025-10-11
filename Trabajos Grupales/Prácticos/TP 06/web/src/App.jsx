import { useState, useEffect } from 'react';
import { getSaludo } from '../services/service_api'

function App() {
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarSaludo = async () => {
      try {
        const data = await getSaludo();
        setMensaje(data.message);
      } catch (err) {
        console.error(err);
        setMensaje('Error al cargar el saludo');
      }
    };
    cargarSaludo();
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="font-montserrat text-4xl text-blue-600">
        {mensaje}
      </h1>
    </div>
  );

}

export default App;