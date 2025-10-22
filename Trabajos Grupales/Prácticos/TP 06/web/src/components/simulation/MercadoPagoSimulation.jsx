import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Spinner from '../common/loaders/Spinner';
import { FaLock, FaPlus, FaCheck } from 'react-icons/fa';
import { SiVisa } from 'react-icons/si';

import { postPaymentStatus } from 'services/purchase.service';


const MercadoPagoSimulation = () => {
    const navigate = useNavigate();
    const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle' | 'processing' | 'success'
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const totalPrice = searchParams.get('total_price');

    const handlePay = async () => {
        setPaymentStatus('processing');
        setError(null);
        try {
            const purchaseId = localStorage.getItem('pendingPurchaseId');
            if (!purchaseId) {
                throw new Error("No se encontró ID de compra pendiente.");
            }
            
            const responseData = await postPaymentStatus(purchaseId);
            const paymentState = responseData?.detalle_compra?.pago?.estado;
            
            if (paymentState === 'PAGO_EXITOSO_POR_TARJETA_EN_MERCADO_PAGO') {
                localStorage.removeItem('pendingPurchaseId');
                navigate('/shop?payment_status=success');
            } else {
                console.warn("Respuesta inesperada del estado de pago:", responseData);
                throw new Error("El estado del pago recibido no fue exitoso.");
            }

        } catch (err) {
            console.error("Error al procesar el pago:", err);
            setError(err.message || "Hubo un problema al confirmar tu pago. Por favor, intenta de nuevo.");
            setPaymentStatus('idle');
        }
    };

    const renderButtonContent = () => {
        switch (paymentStatus) {
            case 'processing':
                return <Spinner />;
            case 'success':
                return <>Pago Aprobado <FaCheck className="ml-2" /></>;
            default:
                return 'Pagar';
        }
    };

    return (
        <div className="h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
            <div className="text-center mb-4">
                <h1 className="text-3xl font-bold text-blue-500">Mercado Pago</h1>
                <p className="text-sm text-gray-500">Finaliza tu compra de forma segura</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center pb-4 border-b">
                    <p className="text-gray-600">Pagas a <span className="font-bold">EcoHarmony Park</span></p>
                    <p className="text-xl font-bold text-gray-800">${totalPrice}</p>
                </div>
                
                <div className="mt-6 flex flex-col gap-4">
                    <div className="flex items-center gap-4 p-3 border-2 border-blue-500 rounded-md bg-blue-50 cursor-pointer">
                        <input type="radio" name="paymentMethod" className="h-4 w-4 text-blue-600" defaultChecked />
                        <SiVisa className="text-2xl text-blue-800" />
                        <div className="flex-grow">
                            <p className="font-semibold text-gray-800">Visa Crédito</p>
                            <p className="text-sm text-gray-500">Terminada en 1234</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 border border-gray-300 rounded-md cursor-pointer">
                        <input type="radio" name="paymentMethod" className="h-4 w-4" />
                        <FaPlus className="text-blue-500" />
                        <p className="text-sm font-semibold text-blue-500">Usar otra tarjeta</p>
                    </div>
                </div>

                <div className="mt-8">
                    <Button
                        onClick={handlePay}
                        disabled={paymentStatus !== 'idle'}
                        className="w-full bg-blue-500 text-white hover:bg-blue-600 h-12 text-base"
                    >
                        {renderButtonContent()}
                    </Button>
                    {error && <p className="mt-2 text-sm text-center text-red-600 font-bold">{error}</p>}
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-gray-500 text-sm">
                <FaLock />
                <p>Tus pagos se realizan de forma segura.</p>
            </div>
        </div>
    );
};

export default MercadoPagoSimulation;