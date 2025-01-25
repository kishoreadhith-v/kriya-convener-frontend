import React, { useState } from "react";
import OtpInput from "react-otp-input";

const KriyaInput = ({ value, handleChange }) => {
  return (
    <div className="flex flex-col justify-center lg:justify-start lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 lg:items-center mt-4">
      <p className="tracking-widest text-4xl font-semibold text-sky-600">
        KRIYA
      </p>
      <OtpInput
        value={value}
        onChange={(val) => handleChange(val)}
        numInputs={4}
        separator={<span></span>}
        isInputNum
        inputStyle={{
          width: "3rem",
          height: "3rem",
          borderRadius: "0.5rem",
          border: "2px solid #0ea5e9",
          margin: "0 0.5rem",
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#0ea5e9",
        }}
        focusStyle={{
          border: "2px solid #005B85",
          outline: "none",
        }}
        shouldAutoFocus
        containerStyle={{}}
      />
    </div>
  );
};

export default KriyaInput;
