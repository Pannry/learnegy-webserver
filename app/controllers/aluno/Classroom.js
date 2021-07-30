const verificarAluno = require('../../middlewares/VerificarAluno');
const asyncHandler = require('../../middlewares/async');
const TurmaDao = require('../../infra/banco/TurmaDao');
const UsuarioDAO = require('../../infra/banco/UsuarioDAO');
const ExercicioDao = require('../../infra/banco/ExercicioDao');
const DidaticoDAO = require('../../infra/banco/DidaticoDAO');

exports.classrooms = asyncHandler(async (req, res, next) => {
  verificarAluno(req, next, async () => {
    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
    };

    const classrooms = new TurmaDao();
    const result = await classrooms.findStudent({ id_aluno: req.user.id });

    ejs.listaSalaAluno = result;
    res.render('aluno/perfil/turmas/minhasTurmas', ejs);
  });
});

exports.findClassrooms = asyncHandler(async (req, res, next) => {
  verificarAluno(req, next, async () => {
    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
    };

    const prof = new UsuarioDAO();
    const result = await prof.findProfessor();

    ejs.listaSalaProfessor = result;
    res.render('aluno/perfil/turmas/selecionarProfessor', ejs);
  });
});

exports.openClassrooms = asyncHandler(async (req, res, next) => {
  verificarAluno(req, next, async () => {
    const entrada = [{ id_aluno: req.user.id }, { id_sala: req.params.id }];

    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
    };

    const classrooms = new TurmaDao();
    const getClass = await classrooms.findStudent({ id_sala: req.params.id });

    ejs.sala = getClass;

    const inclusion = new TurmaDao();
    const result = await inclusion.verify(entrada);

    ejs.aluno_aceito = result[0].aluno_aceito;

    const studentE = new ExercicioDao();
    const getShowList = await studentE.showList(entrada[1].id_sala);

    ejs.lista = getShowList;

    const studentL = new DidaticoDAO();
    const getDidaticList = await studentL.showList(entrada[1].id_sala);
    ejs.didatico = getDidaticList;

    res.render('aluno/perfil/turmas/abrirTurma', ejs);
  });
});

exports.getIntroduceClassrooms = asyncHandler(async (req, res, next) => {
  verificarAluno(req, next, async () => {
    const entrada = {
      id_professor: req.query.idProf,
      cod_sala: req.query.codSala,
    };
    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
    };

    const classrooms = new TurmaDao();
    const result = await classrooms.listTeacherClassrooms(entrada);

    [ejs.detalhesSala] = result;

    res.render('aluno/perfil/turmas/professorTurmas', ejs);
  });
});

exports.postIntroduceClassrooms = asyncHandler(async (req, res, next) => {
  verificarAluno(req, next, async () => {
    const entrada = {
      id_sala: Object.keys(req.body)[0],
      id_aluno: req.user.id,
    };

    const classrooms = new TurmaDao();
    await classrooms.applyToEnter(entrada);
    res.redirect('/turmas');
  });
});
