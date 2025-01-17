import React from "react";
import { FaVideo, FaVideoSlash } from "react-icons/fa6";

const ToggleButton = ({ localStream, videoInput, setVideoInput }) => {
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled; // Toggle the video track
        setVideoInput(videoTrack.enabled); // Update the state
      }
    }
  };

  return (
    <button
      className="text-3xl text-white cursor-pointer hover:scale-110 transition-transform p-2 bg-gray-800 rounded-full shadow-md hover:bg-gray-600"
      onClick={toggleVideo}
    >
      {videoInput ? <FaVideo /> : <FaVideoSlash />}
    </button>
  );
};

export default ToggleButton;
