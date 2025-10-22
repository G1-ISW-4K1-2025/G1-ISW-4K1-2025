import React from 'react';
import TicketForm from '../common/forms/TicketForm';
import IconBtn from '../common/buttons/IconBtn';
import { IoMdAdd } from "react-icons/io";


const TicketList = ({ formData, onTicketChange, addTicket, removeTicket, TICKET_PRICE}) => {
    const { tickets } = formData;

    return (
        <div className="flex flex-col gap-4 pt-4 items-center">
            <div className="flex flex-col gap-5 p-1 w-full">
                {tickets.map((ticket, index) => (
                    <div key={index} >
                        <TicketForm
                            ticketData={ticket}
                            onChange={(field, value) => onTicketChange(index, field, value)}
                            title={`Entrada N°: ${index + 1}`}
                            price={`Precio: ${(ticket.type) ? `$${TICKET_PRICE[ticket.type]}` : '$1000'}`}
                            onRemove={() => {removeTicket(index)}}
                            canBeRemoved={(tickets.length > 1)}
                        />
                    </div>
                ))}
            </div>
            <IconBtn 
                icon={<IoMdAdd size={30}/>}
                onClick={addTicket}
            />
        </div>
    );
};

export default TicketList;