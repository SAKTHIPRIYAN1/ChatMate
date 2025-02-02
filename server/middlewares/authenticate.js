export const authenticateAccessToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) return res.status(401).json({ msg: "Access token required" });
  
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({ msg: "Invalid or expired token" });
  
      req.user = user;
      next();
    });
  };

  