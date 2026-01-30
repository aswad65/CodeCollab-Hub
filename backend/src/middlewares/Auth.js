
import jwt from "jsonwebtoken"



export async function IsAuth(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({ message: "Please login" });
    }

    if (typeof token !== 'string' || token.split('.').length !== 3) {
      console.error('Invalid token format:', token);
      return res.status(401).json({ message: "Invalid token" });
    }

    

    let decoded = jwt.verify(token, process.env.Jwt_secret);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err && err.message ? err.message : err);
    return res.status(401).json({ message: 'Unauthorized User' });
  }
}