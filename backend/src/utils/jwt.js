import jwt from "jsonwebtoken";
import crypto from "crypto";


const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '15m',
      issuer: 'circus-of-wonders',
      audience: 'cow-api',
    });
  };
  
  const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
      issuer: 'circus-of-wonders',
      audience: 'cow-api',
    });
  };
  
  const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'circus-of-wonders',
      audience: 'cow-api',
    });
  };
  
  const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
      issuer: 'circus-of-wonders',
      audience: 'cow-api',
    });
  };
  
  const generateTokenPair = (user) => {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken({ id: user._id }),
    };
  };
  
  const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
  };
  
  const setAuthCookies = (res, accessToken, refreshToken) => {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: process.env.COOKIE_SAME_SITE || 'lax',
      path: '/',
    };
  
    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
  
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/v1/auth/refresh',
    });
  };
  
  const clearAuthCookies = (res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });
  };
  

export {

  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair,
  hashToken,
  setAuthCookies,
  clearAuthCookies,
};