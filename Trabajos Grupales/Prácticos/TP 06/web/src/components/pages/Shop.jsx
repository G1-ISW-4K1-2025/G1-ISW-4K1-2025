import React, {useState, useEffect} from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { validateAndCreatePurchase } from 'services/purchase.service';

import ContentCard from '../common/cards/ContentCard';
import BottomNav from '../common/layout/BottomNav';
import Notification from '../common/Notification';

import DateSelector from '../shop/DateSelector';
import Summary from '../shop/Summary';
import TicketList from '../shop/TicketList';

const STEPS = { DATE: 1, TICKETS: 2, PAYMENT: 3 };
const TOTAL_STEPS = 3;
const TICKET_PRICE = { Regular: 1000, VIP: 2000 };


const Shop = () => {
    const navigate = useNavigate();
    const [notification, setNotification] = useState({});
    const [showNotification, setShowNotification] = useState(false)
    const [submissionStatus, setSubmissionStatus] = useState('waiting'); // waiting, submitting, success
    const [searchParams] = useSearchParams();
    const [currentStep, setCurrentStep] = useState(STEPS.DATE);
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

    useEffect(() => {
        const paymentStatus = searchParams.get('payment_status');
        const savedStep = localStorage.getItem('purchaseShopStep');
        const savedDataJSON = localStorage.getItem('purchaseFormData');

        if (paymentStatus === 'success' && savedStep && savedDataJSON) {

            const savedFormData = JSON.parse(savedDataJSON);
            savedFormData.visitDate = new Date(savedFormData.visitDate);
            console.log(savedFormData)
            const stepToRestore = Number(savedStep);

            setFormData(savedFormData);
            setCurrentStep(stepToRestore);

            setNotification({
                title: "¡Compra Exitosa!",
                message: "Tu pago fue aprobado. En la bandeja de tu correo electrónico tendrás la información de las entradas. ¡Te esperamos!",
                type: "success",
                time: 15000
            });
            setSubmissionStatus('submitting');
            setShowNotification(true);
            setTimeout(() => setSubmissionStatus('success'), 2000);

            localStorage.removeItem('purchaseShopStep');
            localStorage.removeItem('purchaseFormData');
            localStorage.removeItem('pendingPurchaseId');

            navigate('/shop', { replace: true });

            setTimeout(() => navigate('/'), 3000);
        }
    }, [searchParams, navigate]);
    
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
            
            const purchaseResponse = await validateAndCreatePurchase(formData);
            const purchaseId = purchaseResponse.detalle_compra.id_compra;
            
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

    const handleTicketChange = (indexToUpdate, field, value) => {
        if (field === 'name' && value.length > 50) {
            setNotification({
                title: "Texto demasiado largo",
                message: "El nombre no puede exceder los 50 caracteres.",
                type: "fail",
                time: 2000,
            });
            setShowNotification(true);
            return;
        }

        if (field === 'age') {
            const ageNum = Number(value);
            if (value && (!Number.isInteger(ageNum) ||  ageNum < 0 ||  ageNum > 120)) {
                setNotification({
                    title: "Edad inválida",
                    message: "La edad debe ser un número positivo, sin decimales.",
                    type: "fail",
                    time: 2000,
                });
                setShowNotification(true);
                return;
            }
        }

        const updatedTickets = formData.tickets.map((ticket, index) => {
            if (index === indexToUpdate) {
                return { ...ticket, [field]: value };
            }
            return ticket;
        });
        updateFormData({ tickets: updatedTickets });
    }

    const addTicket = () => {
        if (formData.tickets.length >= 10) {
            setNotification({
                title: "Límite alcanzado",
                message: "No puedes comprar más de 10 entradas por transacción.",
                type: "fail",
                time: 2000,
            });
            setShowNotification(true);
            return;
        }
        const newTicket = { name: '', age: '', type: 'Regular', price: '' };
        updateFormData({ tickets: [...formData.tickets, newTicket] });
    }

    const removeTicket = (indexToRemove) => {
        if (formData.tickets.length <= 1) {
            setNotification({
                title: "Acción no permitida",
                message: "Debe haber al menos una entrada en el pedido.",
                type: "fail",
                time: 2000,
            });
            setShowNotification(true);
            return;
        }
        const updatedTickets = formData.tickets.filter((_, index) => index !== indexToRemove);
        updateFormData({ tickets: updatedTickets });
    };

    const handlePaymentMethodChange = (event) => {
        const newPaymentMethod = event.target.value;
        updateFormData({ paymentMethod: newPaymentMethod });
    };

    const calculatePurchaseTotals = () => {
        const subtotal = (formData.tickets || []).reduce((sum, ticket) => {
            const price = TICKET_PRICE[ticket.type] || 0;
            return sum + price;
        }, 0);

        const TAX_RATE = 0.15;
        const PLATFORM_FEE = 1250.50;

        const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
        const total = subtotal + tax + PLATFORM_FEE;

        return { subtotal, tax, platformFee: PLATFORM_FEE, total };
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
                        <TicketList
                            formData={formData}
                            onTicketChange={handleTicketChange}
                            setNotification={setNotification}
                            setShowNotification={setShowNotification}
                            addTicket={addTicket}
                            removeTicket={removeTicket}
                            TICKET_PRICE={TICKET_PRICE}
                        />
                    </div>
                );
            case STEPS.PAYMENT:
                return (
                    <ContentCard
                        tittle={"Resumen de Compra"}
                        description={"Asegurese de que toda la información sea la correcta."}
                        content={
                            <Summary
                                formData={formData}
                                onPaymentMethodChange={handlePaymentMethodChange}
                                purchaseTotals={calculatePurchaseTotals()}
                            />
                        }
                    />
                );
            default:
                return null;
        }
    };
    
    const getBackgroundClass = () => {
        switch (currentStep) {
            case STEPS.DATE:
                return 'bg-fondo1';
            case STEPS.TICKETS:
                return 'bg-fondo2';
            case STEPS.PAYMENT:
                return 'bg-fondo3';
            default:
                return 'bg-fondo1';
        }
    };

    return (
        <div className={`bg-custom-green h-full flex flex-col items-center ${getBackgroundClass()} bg-cover bg-center bg-no-repeat`}>
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