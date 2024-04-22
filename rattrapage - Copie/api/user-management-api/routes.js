const { authenticateToken } = require('./middleware/authMiddleware');
const { authController } = require('./controllers/authController');

module.exports = (app) => {
    app.post('/api/auth/identity/accounts/login', authController.signIn);
    app.get('/api/auth/identity/accounts/logout', authController.signOut);
    app.post('/api/auth/identity/accounts/register', authController.signUp);
    app.get('/api/auth/identity/me', authenticateToken, authController.getSession);
};
