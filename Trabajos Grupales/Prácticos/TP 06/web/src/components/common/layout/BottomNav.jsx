import React from 'react';
import { Button } from '@/components/ui/button';
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import Spinner from '../loaders/Spinner';

const BottomNav = ({ currentStep, totalSteps, onNext, onPrev, onCancel, onConfirmation, submissionStatus }) => {
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === totalSteps;

    const renderConfirmButtonContent = () => {
        switch (submissionStatus) {
            case 'submitting':
                return <Spinner />;
            case 'success':
                return <>¡Éxito! <FaCheck className="ml-2" /></>;
            default:
                return <>Confirmar <FaCheck className="ml-2" /></>;
        }
    };

    return (
        <div className="flex justify-between items-center p-4 bg-white rounded-t-lg w-full">
            {!isFirstStep ? (
                <Button variant="outline" onClick={onPrev}>
                    <FaArrowLeft className="mr-2" /> Atrás
                </Button>
            ) : (
                <Button variant="outline" onClick={onCancel}>
                    <FaTimes className="mr-2" /> Cancelar
                </Button>
            )}

            {!isLastStep ? (
                <Button variant="default" onClick={onNext}>
                    Siguiente <FaArrowRight className="ml-2" />
                </Button>
            ) : (
                <Button 
                    variant="default" 
                    onClick={onConfirmation} 
                    disabled={submissionStatus !== 'waiting'} 
                    className="bg-custom-green"
                >
                    {renderConfirmButtonContent()}
                </Button>
            )}
        </div>
    );
};

export default BottomNav;