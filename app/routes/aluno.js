const express = require('express');
const checkAuth = require('../middlewares/authenticated');

const {
  logout, index,
} = require('../controllers/general');

const {
  getCreate, postCreate,
  getLogin, postLogin,
  getProfile, getUpdateProfile,
} = require('../controllers/aluno/Profile');

const {
  classrooms, findClassrooms, openClassrooms,
  getIntroduceClassrooms, postIntroduceClassrooms,
} = require('../controllers/aluno/Classroom');

const {
  download, openList, getAwnser, postAwnser,
} = require('../controllers/aluno/Exercise');

const router = express.Router();

router
  .route('/')
  .get(index);

router
  .route('/login')
  .get(getLogin)
  .post(postLogin);

router
  .route('/logout')
  .get(logout);

// @Profile
router
  .route('/cadastro')
  .get(getCreate)
  .post(postCreate);

router
  .route('/profile')
  .get(checkAuth, getProfile);

router
  .route('/profile/update')
  .get(checkAuth, getUpdateProfile);

// @Turmas
router
  .route('/turmas')
  .get(classrooms);

router
  .route('/turmas/procurar')
  .get(checkAuth, findClassrooms);

router
  .route('/turma/update')
  .get(checkAuth, getUpdateProfile);

router
  .route('/turmas/abrir/:id')
  .get(checkAuth, openClassrooms);

router
  .route('/turmas/professor/detalhes')
  .get(checkAuth, getIntroduceClassrooms)
  .post(checkAuth, postIntroduceClassrooms);

router
  .route('/turmas/abrir/listas/:id_sala/:id_lista')
  .get(checkAuth, openList);

router
  .route('/turmas/abrir/:id_sala/:id_lista/:id_exercicio')
  .get(checkAuth, getAwnser)
  .post(checkAuth, postAwnser);

router
  .route('/exercicios/download/:id_exercicio/:file_name')
  .get(checkAuth, download);

module.exports = function (app) {
  app.use('/', router);
};

//     Turmas.js

// // Exercicios.js

// router
//   .route('/turmas/abrir/listas/:id_sala/:id_lista')
//   .get(checkAuth, Exercicios.ListaAbrir.get);

// router
//   .route('/turmas/abrir/:id_sala/:id_lista/:id_exercicio')
//   .get(checkAuth, Exercicios.ExerciciosResponder.get)
//   .post(checkAuth, Exercicios.ExerciciosResponder.post);

// router
//   .route('/exercicios/download/:id_exercicio/:file_name')
//   .get(checkAuth, Exercicios.ExerciciosDownloadAluno.get);

// // didatico.js

// router
//   .route('/turmas/didaticos/abrir/:id_sala/:id_didatico')
//   .get(checkAuth, Didaticos.listaDidaticos.get);
// router
//   .route('/turmas/didaticos/abrir/:id_sala/download/:path')
//   .get(checkAuth, Didaticos.DidaticoDownload.get);
// };
