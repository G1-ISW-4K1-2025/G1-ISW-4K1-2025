import React, {useState, useEffect} from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';

import ContentCard from '../common/cards/ContentCard';
import BottomNav from '../common/layout/BottomNav';
import Notification from '../common/Notification';

import DateSelector from '../shop/DateSelector';

const STEPS = { DATE: 1, TICKETS: 2, PAYMENT: 3 };
const TOTAL_STEPS = 3;


const Shop = () => {
    const navigate = useNavigate();
    const [notification, setNotification] = useState({});
    const [showNotification, setShowNotification] = useState(false)
    const [submissionStatus, setSubmissionStatus] = useState('waiting'); // waiting, submitting, success
    const [searchParams] = useSearchParams();
    const [currentStep, setCurrentStep] = useState(STEPS.DATE); // YA ESTA
    const userId = localStorage.getItem('userId')
    const [formData, setFormData] = useState({
        userId: userId,
        visitDate: null,
        tickets: [
            {
                name: '',
                age: '',
                type: '',
                price: '',
            },
        ],
        paymentMethod: '',
    });
    
    const updateFormData = (newData) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };
    
    const handleNext = () => {
        if (currentStep === STEPS.DATE && !formData.visitDate) {
            setNotification({
                title: "Error...",
                message: "Por favor, seleccione una fecha para continuar.",
                type: "alert",
                time: 2000,
            });
            setShowNotification(true)
            return;
        }

        if (currentStep === STEPS.TICKETS) {
            const hasIncompleteTicket = formData.tickets.some(
                (ticket) => !ticket.name.trim() || !ticket.age || !ticket.type
            );

            if (hasIncompleteTicket) {
                setNotification({
                    title: "Campos incompletos",
                    message: "Por favor, complete la información para todas las entradas.",
                    type: "fail",
                    time: 2000,
                });
                setShowNotification(true);
                return;
            } else {
                setNotification({
                    title: "Datos completos",
                    message: "Perfecto! ha completado todos los campos correctamente.",
                    type: "success",
                    time: 2000,
                });
                setShowNotification(true);
            }
        }
        setCurrentStep((prev) => prev + 1);
    };

    const handlePrev = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleCancel = () => {
        setFormData({
            userId: userId,
            visitDate: null,
            tickets: [
                {
                    name: '',
                    age: '',
                    type: '',
                    price: '',
                },
            ],
            paymentMethod: '',
        });
        navigate('/');
    };

    const handleConfirmation = async () => {
        if (submissionStatus !== 'waiting') return;

        if (currentStep === STEPS.PAYMENT && !formData.paymentMethod) {
            setNotification({
                title: "Error...",
                message: "Por favor, seleccione un metodo de pago para continuar.",
                type: "alert",
                time: 2000,
            });
            setShowNotification(true)
            return;
        }

        setSubmissionStatus('submitting');

        try {
            // Aqui seria la llamada al Backend para registrar la compra
            
            // const purchaseResponse = await validateAndCreatePurchase(formData);
            // const purchaseId = purchaseResponse.detalle_compra.id_compra;
            const purchaseResponse = {
                detalle_comra: {
                    precio_total: 4700.5
                }
            }
            const purchaseId = 1;

            
            if (formData.paymentMethod === 'Tarjeta de Credito') {
                localStorage.setItem('pendingPurchaseId', purchaseId);
                localStorage.setItem('purchaseShopStep', currentStep);
                localStorage.setItem('purchaseFormData', JSON.stringify(formData))
                setTimeout(() => {
                    navigate(`/mercadopago?total_price=${purchaseResponse.detalle_compra.precio_total}`);
                }, 3000);

            } else {
                setTimeout(() => {
                    setNotification({
                        title: "¡Reserva Exitosa!",
                        message: "¡Tu pedido fue registrado con éxito! Revisa tu correo para ver los detalles y paga en la boletería para poder ingresar.",
                        type: "success",
                        time: 10000,
                    });
                    setShowNotification(true);

                    setSubmissionStatus('success');

                    setTimeout(() => {
                        navigate('/');
                    }, 2500);

                }, 2000);
            }
        } catch (error) {
            console.error("Error al registrar la compra:", error);
            setNotification({
                title: "Error en el Pedido",
                message: "No pudimos registrar tu pedido. Intenta de nuevo.",
                type: "fail",
                time: 5000,
            });
            setShowNotification(true);
            setSubmissionStatus('waiting');
        }
    }

    const handleDateChange = (selectedDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!selectedDate) {
            updateFormData({ visitDate: '' });
            return;
        }

        if (selectedDate < today) {
            setNotification({
                title: "Fecha inválida",
                message: "No puedes seleccionar una fecha anterior a la de hoy.",
                type: "fail",
                time: 2000,
            });
            setShowNotification(true);
            return;
        }
        if (selectedDate.getDay() === 0) {
            setNotification({
                title: "Parque cerrado",
                message: "El parque se encuentra cerrado los días domingo.",
                type: "fail",
                time: 2000,
            });
            setShowNotification(true);
            return;
        }

        setNotification({
            title: "Fecha Valida",
            message: "Perfecto! Ha seleccionado una fecha disponible.",
            type: "success",
            time: 2000,
        });
        setShowNotification(true);

        updateFormData({ visitDate: selectedDate });
    };
    
    const renderStepContent = () => {
        switch (currentStep) {
            case STEPS.DATE:
                return (
                    <ContentCard
                        tittle={"Seleccione la fecha de visita"}
                        description={"Estamos abiertos de Lunes a Sábado de 9:00 a 18:00 hs"}
                        content={
                            <DateSelector
                                formData={formData}
                                onDateChange={handleDateChange}
                            />
                        }
                    />
                );
            case STEPS.TICKETS:
                return (
                    <div className='overflow-y-auto'>
                        <ContentCard
                            tittle={"Complete la información para cada entrada"}
                            description={"Esta información es importante para el ingreso al parque."}
                        />
                        {/* Listado de Entradas */}
                    </div>
                );
            case STEPS.PAYMENT:
                return (
                    // Aqui va el ContentCard y Summary
                    <div>
                        Resumen de Compra
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        // ${getBackgroundClass()}
        <div className={`bg-custom-green h-full flex flex-col items-center bg-cover bg-center bg-no-repeat`}>
            {showNotification &&
                <Notification
                    title={notification.title}
                    message={notification.message}
                    type={notification.type}
                    time={notification.time}
                    setShowNotification={setShowNotification}
                />
            }

            <main className='min-h-[80dvh] flex-grow p-5 '>
                {renderStepContent()}
            </main>

            {currentStep <= TOTAL_STEPS && (
                <BottomNav
                    currentStep={currentStep}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onCancel={handleCancel}
                    onConfirmation={handleConfirmation}
                    totalSteps={TOTAL_STEPS}
                    submissionStatus={submissionStatus}
                />
            )}
        </div>
    );
};

export default Shop;