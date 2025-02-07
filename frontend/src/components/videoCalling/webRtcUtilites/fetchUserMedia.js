const fetchUserMedia = (callStatus, updateCallStatus, setLocalStream) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Initial constraints for video and audio
      const initialConstraints = {
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      };
      
      

      // Get user media with initial constraints
      const stream = await navigator.mediaDevices.getUserMedia(initialConstraints);

      // Extract video track and check capabilities
      const videoTrack = stream.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities();

      // Update constraints to max resolution and frame rate, if available
      const maxConstraints = {
        width: { exact: capabilities.width?.max || 1920 },
        height: { exact: capabilities.height?.max || 1080 },
        frameRate: { exact: capabilities.frameRate?.max || 60 },
      };

      // Apply maximum constraints
      await videoTrack.applyConstraints(maxConstraints);

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
      } else if (err.name === "OverconstrainedError") {
        console.error("Your device does not support the requested settings.");
      } else {
        console.error("Failed to initialize the call. Please check your device settings.");
      }

      reject(err);
    }
  });
};

export default fetchUserMedia;
