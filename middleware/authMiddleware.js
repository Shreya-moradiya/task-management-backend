import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: 'JWT secret not configured on server',
            });
        }

        // Support both "authorization" (standard) and "authentication" (if frontend uses it)
        const authHeader = req.headers['authorization'] || req.headers['authentication'];

        if (!authHeader) {
            return res.status(401).json({
                message: 'Token required',
            });
        }

        // Accept either "Bearer <token>" or just "<token>"
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : authHeader;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        const isExpired = error.name === 'TokenExpiredError';

        return res.status(401).json({
            message: isExpired ? 'Token expired' : 'Invalid token',
        });
    }
}

export const adminMiddleware = (req, res, next) => {
    // Allow only admins
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            message: 'Access denied. Admins only.',
        });
    }

    next();
}