import React from "react";
import { FaUser } from "react-icons/fa";

const ShopHeader = () => {
    return (
        <header className="bg-white py-6 px-4 flex flex-row items-center justify-between shadow-xl">
            <div className="flex flex-col items-start justify-center">
                <h1 className="text-custom-dark-green font-bold text-end text-2xl">
                    EcoHarmony Park
                </h1>
                <h1 className="text-black font-normal text-end text-xl">
                    Comprar Entrada
                </h1>
            </div>
            <div className='bg-custom-green rounded-full flex items-center justify-center p-3 text-white'>
                <FaUser size={25} />
            </div>
        </header>
    )
};

export default ShopHeader;