const fetchUserMedia = (callStatus, updateCallStatus, setLocalStream) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Initial constraints for video and audio
      const initialConstraints = {
        video: {
          width: { ideal: 1920 }, // Start with high resolution as ideal
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }, // Default to 30fps, adjustable later
        },
        audio: false,
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
        audioEnabled: false,
      };
      console.log("Updated Call Status:", updatedCallStatus);

      // Update the call status and local stream
      updateCallStatus(updatedCallStatus);
      setLocalStream(stream);

      resolve();
    } catch (err) {
      console.error("Error in fetchUserMedia:", err);
      reject(err);
    }
  });
};

export default fetchUserMedia;
