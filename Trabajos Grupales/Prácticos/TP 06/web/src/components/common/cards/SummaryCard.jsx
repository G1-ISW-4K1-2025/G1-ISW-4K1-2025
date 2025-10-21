import React from "react";

const SummaryCard = ({ content }) => {
    return (
        <div className="bg-zinc-200 py-3 px-4 rounded-xl border-custom-green border flex flex-col items-center justify-start">
            {content}
        </div>
    )
};

export default SummaryCard;