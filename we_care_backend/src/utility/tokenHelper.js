// utility/tokenHelper.js
const jwt = require("jsonwebtoken");


exports.EncodeToken = (userData) => {
  return jwt.sign(
    {
      _id: userData._id,
      email: userData.email,
      role: userData.role || "user"  
    },
    process.env.JWT_KEY,
    { expiresIn: "7d" }
  );
};


exports.DecodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    return {
      _id: decoded._id,
      email: decoded.email,
      role: decoded.role  
    };
  } catch (error) {
    return null;
  }
};