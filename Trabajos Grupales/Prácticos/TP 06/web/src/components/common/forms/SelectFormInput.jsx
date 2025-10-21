import React from "react";

const SelectFormInput = ({ title, description, options, value, onChange }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            <p className="text-custom-dark-green">{title}</p>
            <div className="border border-custom-green rounded-xl p-3 bg-white">
                <select 
                    className="w-full bg-transparent focus:outline-none"
                    value={value}
                    onChange={onChange}
                >
                    <option value="" disabled>Seleccione uno...</option>
                    
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            {description && (
                <p className="font-light text-sm">{description}</p>
            )}
        </div>
    );
};

export default SelectFormInput;