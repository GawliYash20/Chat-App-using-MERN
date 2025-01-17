import React, { useEffect, useState, useRef } from "react";

// import useConversation from "../../zustand/useConversation";
import ToggleButton from "./actionButtons/ToggleButton";
import HangUp from "./actionButtons/HangUp";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import createPeerConnection from "./webRtcUtilites/createPeerConn";
import clientSocketListeners from "./webRtcUtilites/clientSocketListeners";





export const AnswerVideoCalling = ({ callStatus, updateCallStatus, localStream, setLocalStream, remoteStream, setRemoteStream, peerConnection, setPeerConnection, offerData, setOfferData, typeOfCall, setTypeOfCall }) => {

  const navigate = useNavigate();
  // console.log(callStatus);
  //parse the context
  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();

  const [videoInput, setVideoInput] = useState(false);
  const remoteVideoRef = useRef(null); //this is a React ref to a dom element, so we can interact with it the React
  const localVideoRef = useRef(null); //this is a React ref to a dom element, so we can interact with it the React
  const [answerCreated, setAnswerCreated] = useState(false);


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


  useEffect(() => {
    if (!localStream) {
      navigate('/');
    } else {
      // set video tags
      remoteVideoRef.current.srcObject = remoteStream;
      console.log(remoteStream);
      localVideoRef.current.srcObject = localStream;
    }
  }, [remoteStream]);

  // add localstream as soon ass peerconnection established:
  useEffect(() => {
    if (peerConnection && localStream) {
      localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
    }
  }, [localStream, peerConnection])


  useEffect(() => {
    if (callStatus.haveMedia && !peerConnection) {
      // now the peerConnection is not initiated
      const { peerConnection, remoteStream } = createPeerConnection(typeOfCall, socket, authUser);
      setPeerConnection(peerConnection)
      setRemoteStream(remoteStream)
    }
  }, [callStatus.haveMedia])




  useEffect(() => {
    if (typeOfCall && peerConnection) {
      clientSocketListeners(socket, typeOfCall, callStatus, updateCallStatus, peerConnection);
    }
  }, [typeOfCall, peerConnection])




  // User has video enabled, but not made an answer
  // let's do it
  useEffect(() => {
    const addOfferAndCreateAnswerAsync = async () => {
      if (!peerConnection) {
        console.error("peerConnection is not initialized");
        return;
      }

      try {
        console.log(peerConnection);
        console.log(offerData);
        await peerConnection.setRemoteDescription(offerData.offer);
        console.log("Creating Answer....");
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        setAnswerCreated(answer);
        // console.log(peerConnection.signalingState);

        const copyOfferData = { ...offerData, answer, answerUserName: authUser._id };
        // console.log(copyOfferData);
        const offerIceCandidates = await socket.emitWithAck('newAnswer', copyOfferData);
        console.log(offerIceCandidates);
        offerIceCandidates.forEach((c) => {
          peerConnection.addIceCandidate(c)
          console.log("==Added Ice Candidate from Offerer==")
        });

      } catch (error) {
        console.error("Error in addOfferAndCreateAnswerAsync: ", error);
      }
    };

    if (!answerCreated && callStatus.videoEnabled) {
      addOfferAndCreateAnswerAsync();
    }
    // addOfferAndCreateAnswerAsync();

  }, [answerCreated, callStatus.videoEnabled, peerConnection]);



  // Function to handle hang-up
  const hangUp = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (peerConnection) {
      peerConnection.close(); // Close the existing connection
      setPeerConnection(null); // Reset the state
    }
    setLocalStream(null);
    setRemoteStream(null);
    navigate('/');
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
