import React from "react";

import SelectFormInput from "../common/forms/SelectFormInput";
import SummaryCard from "../common/cards/SummaryCard";
import { GoDotFill } from "react-icons/go";

const Summary = ({ formData, onPaymentMethodChange, purchaseTotals }) => {

    const paymentMethodOptions = [
        { value: 'Efectivo', label: 'Efectivo' },
        { value: 'Tarjeta de Credito', label: 'Tarjeta de Credito' }
    ];

    const ticketsInfo = () => {
        return (
            <div className="w-full">
                <div className="flex flex-row items-center justify-between">
                    <p className="text-black font-semibold text-lg">Fecha de Visita:</p>
                    <p className="text-zinc-900 font-light ">{formData.visitDate ? formData.visitDate.toLocaleDateString() : 'No seleccionada'}</p>
                </div>

                <p className="text-black font-semibold text-md">Cantidad de Entradas: <span className="font-normal">{formData.tickets.length}</span></p>
                <p className="text-black font-normal text-sm">Información:</p>
                <ul className="mx-2">
                    {formData.tickets.map((ticket, index) => (
                        <li key={index} className="flex flex-row items-center"><GoDotFill /> {ticket.name}, {ticket.age} años, {ticket.type}</li>
                    ))}
                </ul>
            </div >
        )
    }

    const priceInfo = () => {
        const {subtotal, tax, platformFee, total } = purchaseTotals

        return (
            <div className="w-full">
                <p className="text-black font-semibold text-lg">Precio Total</p>
                <ul className="mx-2">
                    <li className="flex flex-row items-center justify-between font-light">Entradas <span className="font-normal">${subtotal}</span></li>
                    <li className="flex flex-row items-center justify-between font-light">Impuestos <span className="font-normal">${tax}</span></li>
                    <li className="flex flex-row items-center justify-between font-light">Costo de Plataforma <span className="font-normal">${platformFee}</span></li>
                    <hr className="border border-zinc-800/40 my-2"></hr>
                    <li className="flex flex-row items-center justify-between font-bold">Total <span className="font-bold">${total}</span></li>
                </ul>
            </div >
        )
    }

    return (
        <div className="w-full flex flex-col gap-4 py-4">
            <SummaryCard
                content={ticketsInfo()}
            />
            <SummaryCard
                content={priceInfo()}
            />

            <SelectFormInput
                title={"Metodo de Pago"}
                options={paymentMethodOptions}
                value={formData.paymentMethod}
                onChange={onPaymentMethodChange}
            />
        </div>
    )
}

export default Summary;