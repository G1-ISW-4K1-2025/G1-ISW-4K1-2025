import React from "react";
import TextFormInput from "./TextFormInput";
import SelectFormInput from "./SelectFormInput"
import { FaTrash } from "react-icons/fa";

const TicketForm = ({ title, price, ticketData, onChange, onRemove, canBeRemoved }) => {
    
    const typeOptions = [
        { value: 'Regular', label: 'Pase Regular' },
        { value: 'VIP', label: 'Pase VIP' }
    ];
    
    return (
        <div className="bg-white py-4 px-4 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <p className="text-lg text-black font-semibold">{title}</p>
                <div className="flex items-center gap-3">
                    <p className="text-lg text-black font-semibold">{price}</p>
                    {canBeRemoved && (
                        <button 
                            onClick={onRemove} 
                            className="text-red-500 hover:text-red-700 transition-colors"
                            aria-label="Eliminar entrada"
                        >
                            <FaTrash />
                        </button>
                    )}
                </div>
            </div>
            <div>
                <TextFormInput
                    title={"Nombre"}
                    value={ticketData.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    type={"text"}
                />
                <div className="flex flex-row">
                    <TextFormInput
                        title={"Edad"}
                        className={"max-w-20 mr-4"}
                        value={ticketData.age}
                        onChange={(e) => onChange('age', e.target.value)}
                        type={"number"}
                    />
                    <SelectFormInput
                        title={"Tipo de Pase"}
                        options={typeOptions}
                        value={ticketData.type}
                        onChange={(e) => onChange('type', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};


export default TicketForm;