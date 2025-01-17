import React from "react";

import peerConfiguration from "./stunServers.js";

const createPeerConnection = (typeOfCall, socket, authUser) => {
  try {
    const peerConnection = new RTCPeerConnection(peerConfiguration);
    //RTCPeerConnection is how WebRTC connects to another browser (peer).
    //It takes a config object, which (here) is just stun servers
    //STUN servers get our ICE candidates
    const remoteStream = new MediaStream();

    //peerConnection listeners
    peerConnection.addEventListener("signalingstatechange", (e) => {
      console.log("Signaling Event Change!");
      console.log(e);
      console.log(peerConnection.signalingState);
    });

    peerConnection.addEventListener("icecandidate", (e) => {
      console.log("Found an ice candidate!");
      if (e.candidate) {
        console.log(typeOfCall);
        if (typeOfCall === "offer") {
          console.log("true");
        }
        // emit the new ice cand. to the signaling server
        socket.emit("sendIceCandidatesToSignallingServer", {
          iceCandidate: e.candidate,
          iceUserName: authUser._id,
          didIOffer: typeOfCall === "offer",
        });
      }
    });

    peerConnection.addEventListener("track", (e) => {
      // the remote has sent us a track!
      // let's add it to our remoteStream
      console.log("Track received:", e.track);
      e.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track, remoteStream);
        console.log("This should add some video/audio to the remote feed...");
      });
    });

    return {
      peerConnection,
      remoteStream,
    };
  } catch (err) {
    console.log(err);
  }

  //   try {
  //     const peerConnection = new RTCPeerConnection(peerConfiguration);
  //     //RTCPeerConnection is how WebRTC connects to another browser (peer).
  //     //It takes a config object, which (here) is just stun servers
  //     //STUN servers get our ICE candidates
  //     const remoteStream = new MediaStream();

  //     // peerConnection listners
  //     peerConnection.addEventListener("signalingstatechange", (e) => {
  //       console.log("Signalling event change!");
  //       // console.log(e);
  //       console.log(peerConnection.signalingState);
  //     });

  //     peerConnection.addEventListener("icecandidate", (e) => {
  //       console.log("Found an ice candidate");
  //       if (e.candidate) {
  //         // emit the iceCand. to signalling server
  //         socket.emit("sendIceCandidatesToSignallingServer", {
  //           iceCandidate: e.candidate,
  //           iceUserName: authUser._id,
  //           didIoffer: typeOfCall === "offer",
  //         });
  //       }
  //     });

  //     peerConnection.addEventListener("track", (e) => {
  //       // the remote has sent us a track!
  //       // let's add it to our remoteStream
  //       e.streams[0].getTracks().forEach((track) => {
  //         remoteStream.addTrack(track, remoteStream);
  //         console.log("This should add some video/audio to the remote feed...");
  //       });
  //     });

  //     return {
  //       peerConnection,
  //       remoteStream,
  //     };
  //   } catch (err) {
  //     console.log(err);
  //   }
};

export default createPeerConnection;
