import React, {useState, useEffect} from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';

import BottomNav from '../common/layout/BottomNav';

const STEPS = { DATE: 1, TICKETS: 2, PAYMENT: 3 };
const TOTAL_STEPS = 3;

const Shop = () => {
    const navigate = useNavigate();
    const [submissionStatus, setSubmissionStatus] = useState('waiting'); // waiting, submitting, success
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
    
    const handleNext = () => {
        // if (currentStep === STEPS.DATE && !formData.visitDate) {
        //     // Notificacion de que debe seleccionar una fecha
        //     console.log("Por favor, seleccione una fecha para continuar.")
        //     return;
        // }

        // if (currentStep === STEPS.TICKETS) {
        //     const hasIncompleteTicket = formData.tickets.some(
        //         (ticket) => !ticket.name.trim() || !ticket.age || !ticket.type
        //     );

        //     if (hasIncompleteTicket) {
        //         // Notificacion de que tiene datos de la entrada incompleto
        //         console.log("Por favor, complete la información para todas las entradas.")
        //         return;
        //     } else {
        //         // Notificacion para confirmar que los datos de las entradas fueron completados correctamente
        //         console.log("Perfecto! ha completado todos los campos correctamente.")
        //         return;
        //     }
        // }
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

        // if (currentStep === STEPS.PAYMENT && !formData.paymentMethod) {
        //     // Notificacion de que debe seleccionar un metodo de pago
        //     console.log("Por favor, seleccione un metodo de pago para continuar.")
        //     return;
        // }

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
                    console.log("Redireccionando a mercado pago")
                    navigate(`/mercadopago?total_price=${purchaseResponse.detalle_compra.precio_total}`);
                }, 3000);

            } else {
                setTimeout(() => {
                    // Notificacion de registro exitoso
                    console.log("¡Tu pedido fue registrado con éxito! Revisa tu correo para ver los detalles y paga en la boletería para poder ingresar.")

                    setSubmissionStatus('success');

                    setTimeout(() => {
                        navigate('/');
                    }, 2500);

                }, 2000);
            }
        } catch (error) {
            console.error("Error al registrar la compra:", error);
            // Notificacion de error
            setSubmissionStatus('waiting');
        }
    }
    
    const renderStepContent = () => {
        switch (currentStep) {
            case STEPS.DATE:
                return (
                    // Aqui va ContentCard con el DateSelector
                    <div>
                        Seleccionar una fecha
                    </div>
                );
            case STEPS.TICKETS:
                return (
                    // Aqui va el ContentCard y el TicketList
                    <div>
                        Lista de entradas
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
        // FALTA AGREGAR "${getBackgroundClass()}" a este div
        <div className={`bg-custom-green h-full flex flex-col items-center bg-cover bg-center bg-no-repeat`}>
            {/* {showNotification &&
                <Notification
                    title={notification.title}
                    message={notification.message}
                    type={notification.type}
                    time={notification.time}
                    setShowNotification={setShowNotification}
                />
            } */}

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
    )
}

export default Shop;