import React from "react";

const PrimaryBtn = ({ children, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={`bg-custom-green text-white font-semibold py-4 px-6 text-3xl rounded-xl shadow-xl
                ${className}`}
        >
            {children}
        </button>
    );
};

export default PrimaryBtn;