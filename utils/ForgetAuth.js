const jwt = require('jsonwebtoken');
const JWT_SECRET = 'SHY23FDA45G2G1K89KH5sec4H8KUTF85ret';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden: Invalid token' });
        }
        req.userId = decoded.userId;
        req.email = decoded.email;
        req.OTP = decoded.OTP;
        next();
    });
}

module.exports = authenticateToken;
