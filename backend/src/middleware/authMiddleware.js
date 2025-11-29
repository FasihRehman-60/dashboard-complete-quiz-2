import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Allow either "Bearer <token>" OR raw "<token>"
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({
        message: "No authentication token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id, 
      email: decoded.email
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired. Please log in again."
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({
        message: "Invalid authentication token"
      });
    }

    console.error("JWT verification failed:", err.message);
    return res.status(500).json({
      message: "Internal authentication error"
    });
  }
};
