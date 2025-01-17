import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { TiMessages } from "react-icons/ti";
import useConversation from "../../zustand/useConversation";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { FaVideo } from "react-icons/fa";
import { useSocketContext } from "../../context/SocketContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import fetchUserMedia from "../videoCalling/webRtcUtilites/fetchUserMedia";

const MessageContainer = ({callStatus, updateCallStatus, localStream, setLocalStream,  remoteStream, setRemoteStream, peerConnection, setPeerConnection, offerData, setOfferData, typeOfCall, setTypeOfCall}) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { onlineUsers, socket } = useSocketContext();
  
  const isOnline = selectedConversation && onlineUsers.includes(selectedConversation._id);
  const navigate = useNavigate();

  // State variable
  
  

  const initCall = async (typeOfCall, res) => {
    try {
      await fetchUserMedia(callStatus, updateCallStatus, setLocalStream);
      setTypeOfCall(typeOfCall);
      if (res) {
        navigate('/answerVideo');
      } else {
        navigate('/video');
      }
    } catch (error) {
      toast.error("Failed to initialize the call. Please check your device settings.");
      console.error("Error in initCall:", error);
    }
  };
  

  const call = async() => {
    initCall('offer')
  }

  const answer = (offer) => {
    const res = true;
    initCall('answer', res)
    // Navigate to the AnswerVideoCalling component with the offer state
    // navigate(`/answerVideo`);
    setOfferData(offer[0])
  }





  // Define the function to answer the video call offer
  const answerOffer = (offer) => {
    console.log("Answering offer:", offer);
    answer(offer)
    
  };



  // Handle video call button click
  const handleVideoClick = () => {
    if (selectedConversation) {
      if (isOnline) {
        call();
      }else {
        toast.error(`${selectedConversation.fullName} is not online `)
      }  
    } else {
      toast.error("No conversation selected");
    }
  };


  // Socket notification
  useEffect(() => {
    if (!socket) {
      console.log("Socket not ready yet, skipping setup");
      return;
    }

    const handleNewOffer = (offer) => {
      
      // setOffers((prev) => [...prev, offer]);
      
    
      // Use offerer information directly from the offer object
      toast.custom((t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                {/* Display offerer's profile pic */}
                <img
                  className="h-10 w-10 rounded-full"
                  src={offer[0].offererProfilePic} // fallback image
                  alt="Offerer Avatar"
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {offer[0].offererFullName}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Incoming video call.
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                answerOffer(offer);
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Answer
            </button>
          </div>
        </div>
      ), { duration: 60000 }); // 1 minute duration
    };
    
    socket.on("newOfferAwaiting", handleNewOffer);

    return () => {
      socket.off("newOfferAwaiting", handleNewOffer);
    };
  }, [socket]);





  useEffect(() => {
    
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);


  //main component

  return (
    <div className="md:min-w-[450px] flex flex-col">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="flex flex-row justify-between items-center bg-slate-500 px-4 py-2 mb-2">
            <div>
              <span className="label-text">To:</span>{" "}
              <span className="text-gray-900 font-bold">
                {selectedConversation.fullName}
              </span>
              {isOnline ? (
                <span className="text-green-500 text-xs italic"> (Online)</span>
              ) : (
                ""
              )}
            </div>
            <div className="">
              <FaVideo
                className="cursor-pointer text-xl hover:text-slate-700"
                onClick={handleVideoClick}
              />
            </div>
          </div>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};

export default MessageContainer;

const NoChatSelected = () => {
  const { authUser } = useAuthContext();
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Welcome 👋 {authUser.fullName} </p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
};
