// middleware/adminAuth.js
const { DecodeToken } = require("../utility/tokenHelper");

const isAdmin = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const decoded = DecodeToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    if (decoded.role !== 'admin' && decoded.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
        yourRole: decoded.role  
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const isSuperAdmin = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const decoded = DecodeToken(token);
    
    if (!decoded || decoded.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Super Admin only."
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = { isAdmin, isSuperAdmin };