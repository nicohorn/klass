import React, { useState } from "react";

const CurrencyInput = ({
  productPrice,
}: {
  productPrice: React.MutableRefObject<any>;
}) => {
  const [amount, setAmount] = useState("");

  const formatCurrency = (value) => {
    const formattedValue = value.replace(/\D/g, ""); // Remove non-numeric characters
    const numberValue = Number(formattedValue);
    return new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numberValue / 100); // Convert back to number before formatting
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const formattedValue = formatCurrency(inputValue);
    setAmount(formattedValue === "0,00" ? "" : formattedValue);
  };

  return (
    <div className="relative flex items-center">
      <span className=" absolute">$</span>
      <input
        ref={productPrice}
        id="precioProducto"
        type="text"
        value={amount}
        onChange={handleChange}
        placeholder="150,000.00"
        className="bg-primary pl-4 outline-none text-lg font-semibold focus:border-b-yellow-500 p-1 border-b-white border-b transition-all duration-150 w-full"
      />
    </div>
  );
};

export default CurrencyInput;
