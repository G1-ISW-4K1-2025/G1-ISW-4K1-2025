import React from "react";

const TextFormInput = ({ title, hasRightButton, rightButtonIcon, rightButtonOnClick, description, value, onChange, type, readOnly, className }) => {
    return (
        <div className={`flex flex-col gap-1 w-full ${className}`}>
            <p className="text-custom-dark-green">{title}</p>
            <div className="flex items-center border border-custom-green rounded-xl gap-4 p-3">
                <input
                    className="w-full bg-transparent overflow-hidden"
                    value={value}
                    onChange={onChange}
                    readOnly={readOnly}
                    type={type} />
                {hasRightButton &&
                    <button
                        className="bg-zinc-800/20 p-2 rounded-xl hover:bg-zinc-800/40"
                        onClick={rightButtonOnClick}
                    >
                        {rightButtonIcon}
                    </button>
                }
            </div>
            <p className="font-light text-sm">{description}</p>
        </div>
    )
};

export default TextFormInput 