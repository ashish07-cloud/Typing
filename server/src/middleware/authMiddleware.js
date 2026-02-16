import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // 1. If no token, it's a guest. Proceed without attaching user.
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null; 
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 2. Hydrate the request with the user ID
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    // 3. If token is provided but INVALID, we reject it. 
    // This prevents "token spoofing."
    return res.status(401).json({ error: "Invalid session. Please log in again." });
  }
}