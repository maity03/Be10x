import React from "react";

const FundCard = ({ fund, onClick, children }) => {
  return (
    <div
      className="bg-white p-4 rounded shadow cursor-pointer hover:bg-green-50 flex justify-between items-center"
      onClick={onClick}
    >
      <div>
        <div className="font-semibold text-lg">
          {fund.schemeName || fund.fundName}
        </div>
        <div className="text-gray-500 text-sm">
          Scheme Code: {fund.schemeCode || fund.fundId}
        </div>
      </div>
      {children}
    </div>
  );
};

export default FundCard;
