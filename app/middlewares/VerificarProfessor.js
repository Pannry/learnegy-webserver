const EhProfessor = (req, next, fn) => {
  if (req.user.tipo === 'professor') {
    return fn();
  }
  return next();
};

module.exports = EhProfessor;
