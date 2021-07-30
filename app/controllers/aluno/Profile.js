const asyncHandler = require('../../middlewares/async');
const verificarAluno = require('../../middlewares/VerificarAluno');
const InstituicaoDAO = require('../../infra/banco/InstituicaoDAO');
const passport = require('passport');

// @Cadastro
exports.getCreate = asyncHandler(async (req, res) => {
  const ejs = {
    message: req.flash('signupMessage'),
  };

  const places = new InstituicaoDAO();
  ejs.listaDeInstituicao = await places.listar();

  res.render('aluno/signup', ejs);
});

exports.postCreate = passport.authenticate('local-signup-aluno', {
  successRedirect: '/profile',
  failureRedirect: '/cadastro',
  failureFlash: true,
});

// @Login
exports.getLogin = asyncHandler(async (req, res) => {
  res.render('aluno/login', { message: req.flash('loginMessage') });
});

exports.postLogin = passport.authenticate('local-login-aluno', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
});

exports.getLogin = asyncHandler(async (req, res) => {
  res.render('aluno/login', { message: req.flash('loginMessage') });
});

// @Profile
exports.getProfile = asyncHandler(async (req, res, next) => {
  verificarAluno(req, next, async () => {
    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
    };
    res.render('aluno/perfil/perfil', ejs);
  });
});

exports.getUpdateProfile = asyncHandler(async (req, res, next) => {
  verificarAluno(req, next, async () => {
    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
    };
    res.render('aluno/perfil/atualizarPerfil', ejs);
  });
});
