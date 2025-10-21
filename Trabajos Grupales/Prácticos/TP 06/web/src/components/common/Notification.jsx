import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Notification = ({ title, message, type, setShowNotification, time}) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowNotification(false);
        }, time);
        return () => clearTimeout(timer);
    }, [ title, message, type, setShowNotification]);
    
    const config = {
        success: {
            containerClasses: 'bg-green-100 border-green-500 text-green-800',
            Icon: FaCheckCircle,
        },
        fail: {
            containerClasses: 'bg-red-100 border-red-500 text-red-800',
            Icon: FaTimesCircle,
        },
    };

    const { containerClasses, Icon } = config[type] || config.fail;

    return (
        <div 
            className={`fixed top-10 w-[90%] max-w-sm p-4 rounded-md shadow-lg flex items-center border-l-4 z-50 ${containerClasses}`} 
            role="alert"
        >
            <div className="flex-shrink-0">
                <Icon className="h-6 w-6" />
            </div>
            <div className="ml-3">
                <p className="font-bold">{title}</p>
                <p className="text-sm">{message}</p>
            </div>
        </div>
    );
};

export default Notification;