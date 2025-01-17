import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import useConversation from "./zustand/useConversation";
import { VideoCalling } from "./components/videoCalling/VideoCalling";
import { AnswerVideoCalling } from "./components/videoCalling/AnswerVideoCalling";
import { useState } from "react";

function App() {
  const { authUser } = useAuthContext();
  

  // Setting up state variables
  const [callStatus, updateCallStatus] = useState({});
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [offerData, setOfferData] = useState(null);
  const [ typeOfCall, setTypeOfCall] = useState()


  

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <Routes>
        <Route path="/" element={authUser ? <Home 
          callStatus={callStatus}
          updateCallStatus={updateCallStatus}
          localStream={localStream}
          setLocalStream={setLocalStream}
          remoteStream={remoteStream}
          setRemoteStream={setRemoteStream}
          peerConnection={peerConnection}
          setPeerConnection={setPeerConnection}
          offerData={offerData}
          setOfferData={setOfferData}
          typeOfCall={typeOfCall}
          setTypeOfCall={setTypeOfCall}
        
        /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={authUser ? <Navigate to='/' /> : <SignUp />} />
        <Route path="/video" element={ authUser ?  
        <VideoCalling
          callStatus={callStatus}
          updateCallStatus={updateCallStatus}
          localStream={localStream}
          setLocalStream={setLocalStream}
          remoteStream={remoteStream}
          setRemoteStream={setRemoteStream}
          peerConnection={peerConnection}
          offerData={offerData}
          setOfferData={setOfferData} 
          setPeerConnection={setPeerConnection}
          typeOfCall={typeOfCall}
          setTypeOfCall={setTypeOfCall}

        />  
        : <Navigate to={authUser ? "/" : "/login"} />}/>
        <Route path="/answerVideo" element={ authUser ?  
        <AnswerVideoCalling 
        callStatus={callStatus}
        updateCallStatus={updateCallStatus}
        localStream={localStream}
        setLocalStream={setLocalStream}
        remoteStream={remoteStream}
        setRemoteStream={setRemoteStream}
        peerConnection={peerConnection} 
        setPeerConnection={setPeerConnection}
        offerData={offerData}
        setOfferData={setOfferData}
        typeOfCall={typeOfCall}
        setTypeOfCall={setTypeOfCall}
        
        /> :  <Navigate to={authUser ? "/" : "/login"} />}/>

      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
