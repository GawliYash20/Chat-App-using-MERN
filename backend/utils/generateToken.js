import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {  //CREATES TOKEN -> TOKEN = SIGN USER WITH JWT_SECRET
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds 
    httpOnly: true, //prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CRSF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "developement"
  });
};

export default generateTokenAndSetCookie;
