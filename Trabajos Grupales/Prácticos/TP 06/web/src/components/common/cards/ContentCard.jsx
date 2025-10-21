import React from "react";

const ContentCard = ({ tittle, description, content }) => {
    return (
        <div className="bg-white py-6 px-4 rounded-xl shadow-xl flex flex-col items-center justify-start">
            <div className="flex-none text-start">
                <p className="text-lg text-black font-semibold">{tittle}</p>
                <p className="text-md text-zinc-950 font-light">{description}</p>
            </div>
            {content}
        </div>
    )
};

export default ContentCard;