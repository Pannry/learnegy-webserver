const EhAluno = (req, next, fn) => {
  if (req.user.tipo === 'aluno') {
    return fn();
  }
  return next();
};

module.exports = EhAluno;
