const fetchUserMedia = (callStatus, updateCallStatus, setLocalStream) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Simplified constraints for broader device support
      const constraints = {
        video: true,
        audio: true,
      };

      // Get user media with basic constraints
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Update call status with media information
      const updatedCallStatus = {
        ...callStatus,
        haveMedia: true,
        videoEnabled: true,
        audioEnabled: true,
      };

      console.log("Updated Call Status:", updatedCallStatus);

      // Update the call status and local stream
      updateCallStatus(updatedCallStatus);
      setLocalStream(stream);

      resolve();
    } catch (err) {
      console.error("Error in fetchUserMedia:", err);

      if (err.name === "NotFoundError") {
        console.error("No camera/microphone found.");
      } else if (err.name === "NotAllowedError") {
        console.error("Permission denied. Please allow camera and microphone access.");
      } else {
        console.error("Failed to initialize the call. Please check your device settings.");
      }

      reject(err);
    }
  });
};

export default fetchUserMedia;
