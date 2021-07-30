const express = require('express');
const upload = require('../middlewares/upload');
const checkAuth = require('../middlewares/authenticated');

const {
  getCreate, postCreate,
  getLogin, postLogin,
  getProfile, getUpdateProfile,
} = require('../controllers/professor/Profile');

const {
  logout,
} = require('../controllers/general');

const {
  classrooms,
  getCreateClassroom, postCreateClassroom,
  getOpenClassroomStudentList, IncludeStudentInClassroom,
  getOpenClassroomDetails, postCommentInDetails,
  getIncludeExerciseList, postIncludeExerciseList,
  getIncludeDidacticList, postIncludeDidacticList,
  deleteClassroom,
} = require('../controllers/professor/Classroom');

const {
  getExercises,
  getCreateExercises, postCreateExercises,
  openExercise, deleteExercise, downloadExercice,
} = require('../controllers/professor/Exercise');

const {
  getLists, openList, showQuestions,
  getCreateList, postCreateList, deleteList,
  getAddQuestionsInList, postAddQuestionsInList,
} = require('../controllers/professor/ExerciseList');

const {
  openDidactic, deleteDidactic,
  getDidactic, downloadDidactic,
  getCreateDidactic, postCreateDidactic,
} = require('../controllers/professor/Didactic');

const {
  professorGET, verRespostas, post,
} = require('../controllers/professor/Grades');

const router = express.Router();

// @Profile
router
  .route('/cadastro')
  .get(getCreate)
  .post(postCreate);

router
  .route('/login')
  .get(getLogin)
  .post(postLogin);

router
  .route('/logout')
  .get(logout);

router
  .route('/profile')
  .get(checkAuth, getProfile);

router
  .route('/profile/update')
  .get(checkAuth, getUpdateProfile);

// @Classroom.js
router
  .route('/turmas')
  .get(checkAuth, classrooms);

router
  .route('/turmas/criar')
  .get(checkAuth, getCreateClassroom)
  .post(checkAuth, postCreateClassroom);

router
  .route('/turma/abrir/:id/professor')
  .get(checkAuth, getOpenClassroomStudentList)
  .post(checkAuth, IncludeStudentInClassroom);

router
  .route('/turma/abrir/:id/aluno')
  .get(checkAuth, getOpenClassroomDetails)
  .post(checkAuth, postCommentInDetails);

// TODO: rota abaixo
router
  .route('/turma/abrir/:id/aluno/incluirlista')
  .get(checkAuth, getIncludeExerciseList)
  .post(checkAuth, postIncludeExerciseList);

// TODO: rota abaixo
router
  .route('/turma/abrir/:id/aluno/incluirDidatico')
  .get(checkAuth, getIncludeDidacticList)
  .post(checkAuth, postIncludeDidacticList);

// TODO: testar .put e .delete
router
  .route('/turmas/excluir/:id')
  .get(checkAuth, deleteClassroom);

// @Exercise.js
router
  .route('/exercicios')
  .get(checkAuth, getExercises);

router
  .route('/exercicios/criar')
  .get(checkAuth, getCreateExercises)
  .post(checkAuth, upload, postCreateExercises);

router
  .route('/exercicios/abrir/:id')
  .get(checkAuth, openExercise);

router
  .route('/exercicios/excluir/:id')
  .get(checkAuth, deleteExercise);

router
  .route('/exercicios/abrir/:id_exercicio/download/:file_name')
  .get(checkAuth, downloadExercice);

// @ExerciseList.js
router
  .route('/exercicios/lista')
  .get(checkAuth, getLists);

router
  .route('/exercicios/lista/criar')
  .get(checkAuth, getCreateList)
  .post(checkAuth, postCreateList);

router
  .route('/exercicios/lista/excluir/:id')
  .get(checkAuth, deleteList);

router
  .route('/exercicios/lista/abrir/:id/info')
  .get(checkAuth, openList);

router
  .route('/exercicios/lista/abrir/:id/questoes')
  .get(checkAuth, showQuestions);

router
  .route('/exercicios/lista/abrir/:id/editar')
  .get(checkAuth, getAddQuestionsInList)
  .post(checkAuth, postAddQuestionsInList);

//  @Didactic.js
router
  .route('/didatico')
  .get(checkAuth, getDidactic);

router
  .route('/didatico/criar')
  .get(checkAuth, getCreateDidactic)
  .post(checkAuth, upload, postCreateDidactic);

router
  .route('/didatico/abrir/:id/')
  .get(checkAuth, openDidactic);

router
  .route('/didatico/excluir/:id')
  .get(checkAuth, deleteDidactic);

router
  .route('/didatico/abrir/:id/download/:path')
  .get(checkAuth, downloadDidactic);

// notas
router
  .route('/turma/abrir/:id_sala/professor/:id_aluno')
  .get(checkAuth, professorGET);

router
  .route('/turma/abrir/:id_sala/professor/:id_aluno/:id_lista')
  .get(checkAuth, verRespostas)
  .post(checkAuth, post);

module.exports = function (app) {
  app.use('/professor', router);
};
