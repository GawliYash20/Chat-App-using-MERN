import React from "react";
import { ImPhoneHangUp } from "react-icons/im";


const HangUp = ({ handleHangUp }) => {
  return (
    <button
      className="text-3xl text-white cursor-pointer hover:scale-110 transition-transform p-2 bg-red-600 rounded-full shadow-md hover:bg-red-500"
      onClick={handleHangUp}
    >
      <ImPhoneHangUp />
    </button>
  );
};

export default HangUp;
