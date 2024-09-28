const jwt = require("jsonwebtoken");

const auth =
  (role = "customer") =>
  (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).json({ msg: "No token, authorization denied" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded", decoded);
      if (decoded.role !== role && role !== "customer")
        return res.status(403).json({ msg: "Access denied" });
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ msg: "Token is not valid" });
    }
  };

module.exports = auth;
