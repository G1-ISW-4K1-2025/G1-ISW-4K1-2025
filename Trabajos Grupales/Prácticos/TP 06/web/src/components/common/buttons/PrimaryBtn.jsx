import React from "react";

const IconBtn = ({ icon, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={`bg-white hover:bg-zinc-100 text-black font-semibold p-6 rounded-full shadow-xl flex items-center justify-center
                ${className}`}>
            {icon}
        </button>
    );
};

export default IconBtn;