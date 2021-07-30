const verificarProfessor = require('../../middlewares/VerificarProfessor');
const asyncHandler = require('../../middlewares/async');
const ListDao = require('../../infra/banco/ListaDao');
const ExercicioDao = require('../../infra/banco/ExercicioDao');

// @Turmas
exports.getLists = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
    };

    const list = new ListDao();
    const result = await list.list({ id_professor: req.user.id });

    ejs.lista = result;
    res.render('professor/perfil/exercicios/lista', ejs);
  });
});

exports.openList = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const listInfo = [
      { id_professor: req.user.id },
      { id: req.params.id },
    ];

    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
      id: req.params.id,
    };

    const list = new ListDao();
    const result = await list.list(listInfo);

    if (result.length === 0) res.render('erro/403', ejs);
    else {
      ejs.lista = result;
      res.render('professor/perfil/exercicios/abrirListaInfo', ejs);
    }
  });
});

exports.showQuestions = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
      id: req.params.id,
    };

    const list = new ListDao();
    const result = await list.showQuestions({ id_lista: req.params.id });

    ejs.exercicios = result;
    res.render('professor/perfil/exercicios/abrirListaExercicios', ejs);
  });
});

exports.getCreateList = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
    };

    res.render('professor/perfil/exercicios/criarLista', ejs);
  });
});

exports.postCreateList = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const entrada = {
      id_professor: req.user.id,
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      tipo: req.body.tipoDeLista,
    };

    const list = new ListDao();
    const result = await list.create(entrada);
    res.redirect(`/professor/exercicios/lista/abrir/${result.insertId}/editar`);
  });
});

exports.deleteList = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const list = new ListDao();
    await list.delete({ id: req.params.id });
    res.redirect('/professor/exercicios/lista');
  });
});

exports.getAddQuestionsInList = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const ejs = {
      user: req.user,
      user_id: req.user.id,
      page_name: req.path,
      accountType: req.user.tipo,
      id_lista: req.params.id,
    };

    const exercises = new ExercicioDao();
    const result = await exercises.list({ id_professor: req.user.id });

    ejs.lista = result;
    res.render('professor/perfil/exercicios/adicionarExercicios', ejs);
  });
});

exports.postAddQuestionsInList = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const checkbox = req.body.options;
    let questoes = [];
    if (!Array.isArray(checkbox)) questoes = Array.of(checkbox);
    else questoes = checkbox;

    if (checkbox !== undefined) {
      const promiseList = [];
      questoes.forEach(async (element) => {
        const returnPromise = new Promise(async (resolve) => {
          const list = new ListDao();
          const entrada = {
            id_lista: req.params.id,
            id_exercicios: element,
          };

          await list.addQuestion(entrada);
          resolve();
        });
        promiseList.push(returnPromise);
      });
      await Promise.all(promiseList);
    }
    res.redirect('/professor/exercicios/lista');
  });
});
