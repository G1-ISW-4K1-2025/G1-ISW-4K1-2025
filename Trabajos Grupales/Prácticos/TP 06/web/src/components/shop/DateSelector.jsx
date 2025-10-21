import React, { useState } from "react";
import TextFormInput from "../common/forms/TextFormInput";
import { Calendar } from "@/components/ui/calendar"
import { SlCalender } from "react-icons/sl";

const DateSelector = ({ formData, onDateChange}) => {
    const [showCalender, setShowCalender] = useState(false);
    

    const handleCalenderOnClick = () => {
        setShowCalender(prev => !prev);
    };

    const handleDateSelect = (selectedDate) => {        
        onDateChange(selectedDate)
        setShowCalender(false);
    };

    return (
        <div className="flex flex-col py-6 gap-5 w-full items-center">
            <TextFormInput
                title={"Fecha"}
                description={"DD/MM/YY"}
                value={formData.visitDate ? formData.visitDate.toLocaleDateString() : ""}
                rightButtonIcon={<SlCalender />}
                rightButtonOnClick={handleCalenderOnClick}
                readOnly
                hasRightButton={true} />
            
            {showCalender && (
                <Calendar
                    mode="single"
                    selected={formData.visitDate}
                    onSelect={handleDateSelect}
                    className="rounded-md border"
                />
            )}
        </div>
    )
};

export default DateSelector;