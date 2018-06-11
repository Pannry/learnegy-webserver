function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
  return 0;
}

module.exports = (app) => {
  const { Profile } = app.controllers.aluno;
  const { Turmas } = app.controllers.aluno;
  const { Exercicios } = app.controllers.aluno;
  const { Didaticos } = app.controllers.aluno;


  app.get('/', (req, res) => {
    (req.user === undefined) ?
      res.render('index', { accountType: '' }) :
      res.render('index', { accountType: req.user.tipo });
  });

  /**
     *      Aluno.js
     */
  app.route('/aluno/signup')
    .get(Profile.cadastro.get)
    .post(Profile.cadastro.post);

  app.route('/aluno/login')
    .get(Profile.login.get)
    .post(Profile.login.post);

  app.route('/profile')
    .get(checkAuth, Profile.profile.get);

  app.route('/profile/update')
    .get(checkAuth, Profile.profile.update);


  /**
     *      Turmas.js
     */
  app.route('/profile/turmas')
    .get(checkAuth, Turmas.painelTurmas.get);

  app.route('/profile/turmas/procurar')
    .get(checkAuth, Turmas.procurarTurmas.get);

  app.route('/turmas/abrir/:id')
    .get(checkAuth, Turmas.abrirTurmas.get);

  app.route('/turmas/professor/:id')
    .get(checkAuth, Turmas.professorTurmas.get)
    .post(checkAuth, Turmas.professorTurmas.post);

  // Exercicios.js

  app.route('/turmas/abrir/listas/:id_sala/:id_lista')
    .get(checkAuth, Exercicios.listaExercicios.get);

  app.route('/turmas/abrir/:id_sala/:id_lista/:id_exercicio')
    .get(checkAuth, Exercicios.responderExercicios.get)
    .post(checkAuth, Exercicios.responderExercicios.post);

  // didatico.js

  app.route('/turmas/didaticos/abrir/:id_sala/:id_didatico')
    .get(checkAuth, Didaticos.listaDidaticos.get);
};
