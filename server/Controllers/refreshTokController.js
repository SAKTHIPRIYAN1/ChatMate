import jwt from 'jsonwebtoken';
import User from '../Models/UserModel.js';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ;

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id,name:user.name,email: user.email  }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};


export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id,name:user.name,email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: '10d' });
};


export const refreshTokenHandler = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(403).json({ msg: 'Refresh token is required' });
  
    try {
      
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  
      // Check the token in the database
      const user = await User.findById(decoded.id);
      if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }
  
      // Generate a new access token
      const newAccessToken = jwt.sign({ id: user.id, email: user.email }, ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
      });
  
      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(403).json({ msg: 'Invalid or expired refresh token' });
    }
    
};
  

