import React from "react";
import { FaTree } from "react-icons/fa";

const HomeHeader = () => {
    return (
        <header className="bg-custom-green py-6 px-4 shadow-xl flex flex-row items-center justify-between text-custom-dark-green">
            <FaTree size={50}/>
            <h1 className="font-bold text-end text-3xl">
                EcoHarmony Park
            </h1>
        </header>
    )
};

export default HomeHeader;