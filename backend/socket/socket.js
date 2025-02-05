import { Server } from "socket.io";
// import http from "http";
import https from "https";
import express from "express";
import fs from "fs";

const app = express();

// const key = fs.readFileSync("cert.key");
// const cert = fs.readFileSync("cert.crt");

// const server = https.createServer({ key, cert }, app);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin: ["https://localhost:3000", "https://192.168.1.32:3000"],
    origin: ["https://chat-app-using-mern-5eez.onrender.com"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// getRecieverSocketId
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // { userId: socketId }
let offers = [
  // offererUserName
  // offer
  // offerIceCandidates
  // answererUserName
  // answer
  // answererIceCandidates
]; // Stores all offers

io.on("connection", (socket) => {
  // console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // Emit the list of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    // console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // Emit available offers to the new client
  if (offers.length) {
    socket.emit("availableOffers", offers);
  }

  socket.on("newOffer", ({ offer, authUser }) => {
    // const existingOffer = offers.find(
    //   (offer) => offer.offererUserName === userId
    // );
    // if (existingOffer) {
    //   console.log("Offer already exists for this user");
    //   return;
    // }
    // console.log("new offer recieved",offer)
    // console.log('')

    offers.push({
      offererFullName: authUser.fullName,
      offererProfilePic: authUser.profilePic,
      offererUserName: userId,
      offer: offer,
      offerIceCandidates: [],
      answererUserName: null,
      answer: null,
      answererIceCandidates: [],
    });

    // console.log(offers)

    // send out to all connected sockets except caller
    socket.broadcast.emit("newOfferAwaiting", offers.slice(-1));
  });

  socket.on("newAnswer", (offerObj, ackFunction) => {
    // console.log("Received newAnswer event with data:", offerObj);
    // console.log("On event newAnswer", offerObj);

    const socketIdToAnswer = userSocketMap[offerObj.offererUserName];
    if (!socketIdToAnswer) {
      console.log("No matching socket for offerer:", offerObj.offererUserName);
      return;
    }

    const offerToUpdate = offers.find(
      (o) => o.offererUserName === offerObj.offererUserName
    );

    if (!offerToUpdate) {
      console.log("Offer not found for offerer:", offerObj.offererUserName);
      return;
    }
    // console.log("OfferToUpdate", offerToUpdate);

    // Acknowledge the answer with any existing ICE candidates
    if (ackFunction) {
      ackFunction(offerToUpdate.offerIceCandidates);
    } else {
      console.warn("Acknowledgement function is not provided.");
    }

    // Update the offer with the answer details
    offerToUpdate.answer = offerObj.answer;
    offerToUpdate.answererUserName = userId;

    // Emit the answer response back to the offerer
    // socket.to(socketIdToAnswer).emit("answerResponse", {
    //   offer: offerToUpdate.offer, // Send only the specific offer
    //   answer: offerObj.answer,
    //   answererUserName: userId,
    //   offerIceCandidates: offerToUpdate.offerIceCandidates,
    // });
    // console.log(offerToUpdate);
    socket.to(socketIdToAnswer).emit("answerResponse", offerToUpdate);
  });

  socket.on("sendIceCandidatesToSignallingServer", (iceCandidateObj) => {
    // console.log(iceCandidateObj);
    const { didIOffer, iceUserName, iceCandidate } = iceCandidateObj;
    // console.log(didIOffer);
    if (didIOffer) {
      console.log("Sending ice candidates");
      const offerInOffers = offers.find(
        (o) => o.offererUserName === iceUserName
      );

      if (offerInOffers) {
        offerInOffers.offerIceCandidates.push(iceCandidate);
        // 1. When the answerer answers, all existing ice candidates are sent
        // 2. Any candidates that come in after the offer has been answered, will be passed through

        if (offerInOffers.answererUserName) {
          console.log(
            "from ice cand emit ansuserName",
            offerInOffers.answererUserName
          );
          const socketIdToSendTo =
            userSocketMap[offerInOffers.answererUserName];
          console.log("SocketToSendTO", socketIdToSendTo);
          if (socketIdToSendTo) {
            socket
              .to(socketIdToSendTo)
              .emit("receivedIceCandidateFromServer", iceCandidate);
          } else {
            console.log("Ice candidate received but could not find answerer");
          }
        }
      } else {
        //this ice is coming from the answerer. Send to offerer
        //pass it through to other socket
        const offerInOffers = offers.find(
          (o) => o.answererUserName === iceUserName
        );
        const socketIdToSendTo = userSocketMap[offerInOffers.offererUserName];
        if (socketIdToSendTo) {
          socket
            .to(socketIdToSendTo)
            .emit("receivedIceCandidateFromServer", iceCandidate);
        } else {
          console.log("Ice candidate recieved but could not find offerer");
        }
      }
    }
  });

  socket.on("callEnded", (id) => {
    console.log(id);
    // Remove any offers associated with the user who ended the call
    offers = offers.filter((o) => o.offererUserName !== id);
    console.log("callEnded: Offers updated for user", id);

    // Notify other users if needed
    // io.emit("offerListUpdated", offers); // Optional if others need to sync the offer state
  });
});

export { app, io, server };
