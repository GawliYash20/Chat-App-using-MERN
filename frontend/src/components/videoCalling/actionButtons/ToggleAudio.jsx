import React from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa6";

const ToggleAudio = ({ localStream, callStatus, updateCallStatus }) => {
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        const isEnabled = !audioTrack.enabled; // Toggle audio
        audioTrack.enabled = isEnabled; 
        console.log(callStatus)

        // Use function callback to update state
        updateCallStatus((prev) => ({ ...prev, audioEnabled: isEnabled }));
      }
    }
  };

  return (
    <button
      className="text-3xl text-white cursor-pointer hover:scale-110 transition-transform p-2 bg-gray-800 rounded-full shadow-md hover:bg-gray-600"
      onClick={toggleAudio}
    >
      {callStatus.audioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
    </button>
  );
};

export default ToggleAudio;
