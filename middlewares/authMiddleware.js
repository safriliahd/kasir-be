module.exports = {
    isLoggedIn: (req, res, next) => {
      if (req.session.userId) {
        return next();
      }
      res.status(401).json({ error: 'Unauthorized, please log in' });
    },
  
    isAdmin: (req, res, next) => {
      if (req.session.role === 'ADMIN') {
        return next();
      }
      res.status(403).json({ error: 'Forbidden, admin access only' });
    },

    isAdminOrPetugas: (req, res, next) => {
      if (req.session.role === 'ADMIN' || req.session.role === 'PETUGAS') {
        return next();
      }
      res.status(403).json({ error: 'Forbidden, only ADMIN or PETUGAS access allowed' });
    },
  };
  