const verificarProfessor = require('../../middlewares/VerificarProfessor');
const asyncHandler = require('../../middlewares/async');
const Professor = require('../../models/professor');
const Sala = require('../../models/Sala');
const ListaDeTurmas = require('../../models/ListaDeSalas');
const TurmaDao = require('../../infra/banco/TurmaDao');
const ExercicioDao = require('../../infra/banco/ExercicioDao');
const DidaticoDAO = require('../../infra/banco/DidaticoDAO');

// @Turmas
exports.classrooms = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const professor = new Professor(req);
    const classrooms = new TurmaDao();

    const salas = await classrooms.find({ id_professor: professor.id_professor });
    const listaDeSalas = new ListaDeTurmas(salas);

    res.render('professor/perfil/turmas/turmas', { Salas: listaDeSalas.Salas });
  });
});

exports.getCreateClassroom = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const professor = new Professor(req);
    res.render('professor/perfil/turmas/criarTurma', professor);
  });
});

exports.postCreateClassroom = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const classrooms = new TurmaDao();
    const professor = new Professor(req);
    const turma = new Sala(req.body);

    turma.setCode(Date.now().toString().substring(3, 13));
    turma.setComment('');
    const a = turma.InformacoesSala(professor.getId());

    await classrooms.create(a);

    res.redirect('/professor/turmas');
  });
});

exports.getOpenClassroomStudentList = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
      idSala: req.params.id,
    };

    const classrooms = new TurmaDao();
    const classInformation = await classrooms.find({ id: req.params.id });

    ejs.infoProfessor = classInformation;

    const studentsList = new TurmaDao();
    const result = await studentsList.listarAlunos({ id_sala: req.params.id });

    ejs.listaDeAlunos = result;

    if (classInformation.length !== 0) {
      if (classInformation[0].id_professor === req.user.id) {
        res.render('professor/perfil/turmas/abrirTurmaProfessor', ejs);
      } else {
        res.render('erro/403', ejs);
      }
    }
  });
});

exports.IncludeStudentInClassroom = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const entrada = [{ id_sala: req.params.id }, { id_aluno: Object.keys(req.body)[0] }];

    const classroom = new TurmaDao();
    await classroom.includeStudent(entrada);

    res.redirect(`/professor/turma/abrir/${entrada[0].id_sala}/professor`);
  });
});

exports.getOpenClassroomDetails = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
      idSala: req.params.id,
    };

    const classrooms = new TurmaDao();
    const room = await classrooms.find({ id: req.params.id });

    ejs.infoProfessor = room;

    const exerciseList = new ExercicioDao();
    const elist = await exerciseList.showList(req.params.id);

    ejs.lista = elist;

    const didatic = new DidaticoDAO();
    const dlist = await didatic.showList(req.params.id);

    ejs.didatico = dlist;

    if (room.length !== 0) {
      if (room[0].id_professor === req.user.id) {
        res.render('professor/perfil/turmas/abrirTurmaAluno', ejs);
      } else {
        res.render('erro/403', ejs);
      }
    }
  });
});

exports.postCommentInDetails = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const entrada = {
      id: {
        id: req.params.id,
      },
      com: {
        comentario: req.body.comentario,
      },
    };

    const classrooms = new TurmaDao();
    await classrooms.editComment(entrada);
    res.redirect(`/professor/turma/abrir/${entrada.id.id}/aluno`);
  });
});

exports.getIncludeExerciseList = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
      idSala: req.params.id,
    };

    const exercise = new ExercicioDao();
    ejs.lista = await exercise.listInfo({ id_professor: req.user.id });
    res.render('professor/perfil/turmas/listarListaParaAdicionar', ejs);
  });
});

exports.postIncludeExerciseList = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const checkbox = req.body.options;
    let listas = [];

    if (!Array.isArray(checkbox)) listas = Array.of(checkbox);
    else listas = checkbox;

    if (checkbox !== undefined) {
      const promiseList = [];
      listas.forEach(async (element) => {
        const returnPromise = new Promise(async (resolve) => {
          const exercise = new ExercicioDao();
          const entrada = {
            id_sala: req.params.id,
            id_lista: element,
          };
          await exercise.listasParaIncluir(entrada);
          resolve();
        });
        promiseList.push(returnPromise);
      });
      await Promise.all(promiseList);
    }

    res.redirect(`/professor/turma/abrir/${req.params.id}/aluno`);
  });
});

exports.getIncludeDidacticList = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
      idSala: req.params.id,
    };

    const didactic = new DidaticoDAO();
    ejs.lista = await didactic.list({ id_professor: req.user.id });
    res.render('professor/perfil/turmas/listarDidaticoParaAdicionar', ejs);
  });
});

exports.postIncludeDidacticList = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const checkbox = req.body.options;
    let materiais = [];
    if (!Array.isArray(checkbox)) materiais = Array.of(checkbox);
    else materiais = checkbox;

    if (checkbox !== undefined) {
      const promiseList = [];
      materiais.forEach(async (element) => {
        const returnPromise = new Promise(async (resolve) => {
          const didactic = new DidaticoDAO();
          const entrada = {
            id_sala: req.params.id,
            id_didatico: element,
          };
          await didactic.didaticoParaIncluir(entrada);
          resolve();
        });
        promiseList.push(returnPromise);
      });
      await Promise.all(promiseList);
    }
    res.redirect(`/professor/turma/abrir/${req.params.id}/aluno`);
  });
});

exports.deleteClassroom = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const classroom = new TurmaDao();
    await classroom.delete({ id: req.params.id });
    res.redirect('/professor/turmas');
  });
});
