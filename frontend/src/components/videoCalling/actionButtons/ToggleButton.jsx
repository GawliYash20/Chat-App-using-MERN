import React from "react";
import { FaVideo, FaVideoSlash } from "react-icons/fa6";

const ToggleButton = ({ localStream, videoInput, setVideoInput, callStatus, updateCallStatus }) => {
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled; // Toggle the video track
        const copyCallStatus = { ...callStatus };
        copyCallStatus.videoEnabled = videoTrack.enabled; // Update the call status
        updateCallStatus(copyCallStatus); // Update the call
        
      }
    }
  };

  return (
    <button
      className="text-3xl text-white cursor-pointer hover:scale-110 transition-transform p-2 bg-gray-800 rounded-full shadow-md hover:bg-gray-600"
      onClick={toggleVideo}
    >
      {callStatus.videoEnabled ? <FaVideo /> : <FaVideoSlash />}
    </button>
  );
};

export default ToggleButton;
