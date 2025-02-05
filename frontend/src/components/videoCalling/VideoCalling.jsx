import React, { useEffect, useState, useRef } from "react";
import ToggleButton from "./actionButtons/ToggleButton";
import HangUp from "./actionButtons/HangUp";
import { useNavigate } from "react-router-dom";
import clientSocketListeners from "./webRtcUtilites/clientSocketListeners";
import createPeerConnection from "./webRtcUtilites/createPeerConn";
import { useSocketContext } from "../../context/SocketContext";
import { useAuthContext } from "../../context/AuthContext";

export const VideoCalling = ({
  callStatus,
  updateCallStatus,
  localStream,
  setLocalStream,
  remoteStream,
  setRemoteStream,
  peerConnection,
  setPeerConnection,
  typeOfCall,
  setTypeOfCall,
}) => {
  const [offerCreated, setOfferCreated] = useState(false);
  const [videoStyles, setVideoStyles] = useState({});
  const [videoInput, setVideoInput] = useState();
  const { onlineUsers, socket } = useSocketContext();
  const { authUser } = useAuthContext();
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Dynamically adjust video container size
  useEffect(() => {
    const adjustVideoSize = (videoRef) => {
      if (videoRef.current) {
        const video = videoRef.current;
        video.addEventListener("loadedmetadata", () => {
          const { videoWidth, videoHeight } = video;
          const aspectRatio = videoWidth / videoHeight;

          setVideoStyles(aspectRatio > 1 ? { width: "100%", height: "auto" } : { width: "auto", height: "100%" });
        });
      }
    };

    adjustVideoSize(remoteVideoRef);
    adjustVideoSize(localVideoRef);

    return () => {
      if (remoteVideoRef.current) remoteVideoRef.current.removeEventListener("loadedmetadata", adjustVideoSize);
      if (localVideoRef.current) localVideoRef.current.removeEventListener("loadedmetadata", adjustVideoSize);
    };
  }, [remoteVideoRef, localVideoRef]);

  // Initialize streams in video elements
  useEffect(() => {
    if (!localStream) navigate("/");
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
  }, [remoteStream, localStream]);

  // Add local stream to peer connection
  useEffect(() => {
    if (peerConnection && localStream) {
      localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));
    }
  }, [localStream, peerConnection]);

  // Create peer connection
  useEffect(() => {
    if (callStatus.haveMedia && !peerConnection) {
      const { peerConnection, remoteStream } = createPeerConnection(typeOfCall, socket, authUser);
      setPeerConnection(peerConnection);
      setRemoteStream(remoteStream);
    }
  }, [callStatus.haveMedia]);

  // Handle socket listeners
  useEffect(() => {
    if (typeOfCall && peerConnection) {
      clientSocketListeners(socket, typeOfCall, callStatus, updateCallStatus, peerConnection);
    }
  }, [typeOfCall, peerConnection]);

  // Share video by creating an offer
  useEffect(() => {
    const shareVideoAsync = async () => {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit("newOffer", { offer, authUser });
      setOfferCreated(true);
    };

    if (!offerCreated && callStatus.videoEnabled && peerConnection) {
      shareVideoAsync();
    }
  }, [offerCreated, peerConnection]);

  // Add remote answer
  useEffect(() => {
    const addAnswerAsync = async () => {
      if (peerConnection?.signalingState === "have-local-offer") {
        await peerConnection.setRemoteDescription(callStatus.answer);
      }
    };

    if (callStatus.answer && peerConnection) {
      addAnswerAsync();
    }
  }, [callStatus.answer, peerConnection]);

  // Handle hang-up action
  const hangUp = () => {
    if (localStream) localStream.getTracks().forEach((track) => track.stop());
    if (peerConnection) peerConnection.close();

    socket.emit("callEnded", authUser._id);
    setLocalStream(null);
    setRemoteStream(null);
    setPeerConnection(null);
    navigate("/");
  };

  return (
    <div className="container flex flex-col bg-black h-5/6 w-3/5 rounded-lg shadow-lg overflow-hidden">
      {/* Video Box */}
      <div className="flex-1 relative bg-gray-900 rounded-t-lg max-h-[calc(100vh-100px)] overflow-hidden">
        <video
          id="remote-feed"
          ref={remoteVideoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          playsInline
        ></video>
        <video
          id="local-feed"
          ref={localVideoRef}
          className="absolute bottom-4 left-4 w-32 h-32 object-cover border-4 border-white rounded-lg shadow-md transform scale-x-[-1]"
          autoPlay
          playsInline
        ></video>
      </div>

      {/* Controls */}
      <div className="sticky bottom-0 flex justify-center items-center gap-4 p-4 bg-base-200 backdrop-blur-lg rounded-b-lg z-10">
        <button className="btn btn-primary btn-circle shadow-md">
          <ToggleButton
            localStream={localStream}
            videoInput={videoInput}
            setVideoInput={setVideoInput}
          />
        </button>
        <button className="btn btn-error btn-circle shadow-md">
          <HangUp handleHangUp={hangUp} />
        </button>
      </div>
    </div>
  );

};
