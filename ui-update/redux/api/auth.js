import * as common from './common';

// Sign up
export const signup = params => common.sendPost('/auth/signup', params);
export const fbSignup = params => common.sendPost('/auth/facebook/signup', params);
// Login
export const login = params => common.sendPost('/auth/login', params);
// Logout
export const logout = () => common.sendGet('/auth/logout');
// Captcha
export const getCaptcha = () => common.sendGet('/auth/captcha');
// Forgot password
export const getPwdResetLink = email => common.sendGet(`/auth/forgot/${email}`);
export const checkPwdResetLink = resetId => common.sendGet(`/auth/reset/${resetId}`);
export const resetPassword = (resetId, params) => common.sendPost(`/auth/reset/${resetId}`, params);
// Verify email
export const sendVerifyEmail = email => common.sendGet(`/auth/verify/send/${email}`);
export const verifyEmail = verifyId => common.sendGet(`/auth/verify/email/${verifyId}`);
// Check auth
export const checkAuth = (req = null) => common.sendGet('/auth/check', req);
// Profile
export const updateProfile = params => common.sendPost(`/auth/profile/update`, params);

// Settings
export const getSettings = () => common.sendGet('/auth/settings');
export const updateSettings = params => common.sendPost('/auth/settings', params);

// Legacy organisations
export const legacyLogin = params => common.sendPost('/legacy/login', params);
export const legacySignup = params => common.sendPost('/legacy/signup', params);

// Search
export const searchAll = params => common.sendPost(`/auth/search`, params);

// Send token
export const sendTokenTo = params => common.sendPost(`/auth/token/send`, params);
