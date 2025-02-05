import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = ({callStatus, updateCallStatus, localStream, setLocalStream,  remoteStream, setRemoteStream, peerConnection, setPeerConnection, offerData, setOfferData, typeOfCall, setTypeOfCall}) => {
  return (
    <div
      className="flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding 
    backdrop-filter backdrop-blur-lg bg-opacity-0"
    >
      <Sidebar />
      <MessageContainer
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
        setTypeOfCall={setTypeOfCall}
      />
    </div>
  );
};

export default Home;
