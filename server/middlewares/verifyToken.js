import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized: No token provided",
            error: true,
            success: false
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: "Unauthorized: Invalid token",
                error: true,
                success: false
            });
        }

        // ✅ Attach userId to request object
        req.userId = decoded.id || decoded._id; // token contains id or _id
        next();
    });
};

export default verifyToken;
