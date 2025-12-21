function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Unauthorized - Please login first" });
  }
  next();
}

function requireAuthExceptPost(req, res, next) {
  if (req.method === 'POST') {
    return next();
  }
  return requireAuth(req, res, next);
}

module.exports = { requireAuth, requireAuthExceptPost };
