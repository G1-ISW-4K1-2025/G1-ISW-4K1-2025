import React from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryBtn from '../common/buttons/PrimaryBtn';
import { FaUser, FaMapMarkedAlt, FaCalendarAlt } from "react-icons/fa";

const FeatureCard = ({ icon, title, description, onClick, isEnabled = false }) => (
    <div
        onClick={isEnabled ? onClick : null}
        className={`bg-white p-4 rounded-xl shadow-md flex flex-col items-center text-center 
                    ${isEnabled ? 'cursor-pointer transform hover:scale-105 transition-transform' : 'opacity-50'}`}
    >
        <div className='text-3xl text-custom-green mb-2'>{icon}</div>
        <h3 className='font-bold text-gray-800 text-md'>{title}</h3>
        <p className='text-xs text-gray-500'>{description}</p>
    </div>
);


const Home = () => {
    const navigate = useNavigate();
    const userId = 1;
    localStorage.setItem('userId', userId);

    const handleShopOnClick = () => {
        navigate('/shop');
    };

    return (
        <div className='h-screen bg-zinc-50 flex flex-col'>
            <header className='py-10 px-4 flex flex-row justify-between items-center'>
                <div className='bg-custom-green rounded-full flex items-center justify-center p-6 text-white'>
                    <FaUser size={30} />
                </div>
                <p className='font-semibold text-end text-lg text-gray-700'>
                    Hola, "Usuario Ejemplo"<br />
                    <span className='font-normal text-gray-500'>bienvenido/a.</span>
                </p>
            </header>

            <main className='flex-grow flex flex-col px-5 gap-6'>
                <div className='bg-white p-6 rounded-xl shadow-lg text-center'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-2'>¡Tu Aventura Comienza Aquí!</h2>
                    <p className='text-gray-600 mb-6'>Asegura tu lugar en el parque y vive una experiencia inolvidable.</p>
                    <PrimaryBtn
                        children={"Comprar Entradas"}
                        onClick={handleShopOnClick}
                        className="w-full"
                    />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <FeatureCard
                        icon={<FaMapMarkedAlt />}
                        title="Mapa Interactivo"
                        description="Explora el parque y encuentra tus exhibiciones favoritas."
                        isEnabled={false}
                    />
                    <FeatureCard
                        icon={<FaCalendarAlt />}
                        title="Actividades del Día"
                        description="Consulta los horarios de alimentación y los shows."
                        isEnabled={false}
                    />
                </div>
            </main>

            <footer className='py-4 text-center text-xs text-gray-400'>
                <p>EcoHarmony Park &copy; 2025</p>
            </footer>
        </div>
    );
};

export default Home;