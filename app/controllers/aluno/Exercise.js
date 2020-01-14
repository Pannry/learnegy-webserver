const asyncHandler = require('../../middlewares/async');
const ExercicioDao = require('../../infra/banco/ExercicioDao');

exports.download = asyncHandler(async (req, res, next) => {
  if (req.user.tipo === 'aluno') {
    const entrada = [req.params.id_exercicio, req.params.file_name];

    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
    };

    const exercises = new ExercicioDao();
    const downloadFilesName = await exercises.download(entrada);

    if (downloadFilesName.length === 0) {
      res.render('erro/403', ejs);
    } else {
      res.download(`app/uploads/${downloadFilesName[0].file_name}`);
    }
  } else {
    next();
  }
});

exports.openList = asyncHandler(async (req, res, next) => {
  if (req.user.tipo === 'aluno') {
    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
      sala: req.params.id_sala,
      lista: req.params.id_lista,
    };

    let exercises = new ExercicioDao();
    let result = await exercises.openList({ id_lista: req.params.id_lista });
    ejs.exercicios = result;

    exercises = new ExercicioDao();
    result = await exercises.listInfo({ id: req.params.id_lista });
    ejs.listaInfo = result;

    res.render('aluno/perfil/exercicios/abrirListaAluno', ejs);
  } else {
    next();
  }
});

exports.getAwnser = asyncHandler(async (req, res, next) => {
  if (req.user.tipo === 'aluno') {
    // const exercicio = [{ id: req.params.id_exercicio }, { id_aluno: req.user.id }];
    const exercicio = [{ id: req.params.id_exercicio }];
    const entrada = [
      { id_sala: req.params.id_sala },
      { id_exercicios: req.params.id_exercicio },
      { id_aluno: req.user.id },
    ];

    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
      sala: req.params.id_sala,
      lista: req.params.id_lista,
    };

    let exercise = new ExercicioDao();
    let result = await exercise.list(exercicio);
    ejs.exercicio = result;

    exercise = new ExercicioDao();
    result = await exercise.downloadPaths(exercicio);
    ejs.file_name = result;

    exercise = new ExercicioDao();
    result = await exercise.listAwnser(entrada);
    if (result.length === 0) {
      const resposta = [
        ...entrada,
        { resposta: '' },
        { file_name: '' }, // TODO: futuramente o aluno só poderá enviar um arquivos
      ];
      const obj = {};

      exercise = new ExercicioDao();
      resposta.forEach(key => Object.assign(obj, key));
      await exercise.createAwnser(obj);

      ejs.respostaAluno = '';
    } else {
      ejs.respostaAluno = result[0].resposta;
    }

    res.render('aluno/perfil/exercicios/responderExercicio', ejs);
  } else {
    next();
  }
});

exports.postAwnser = asyncHandler(async (req, res, next) => {
  if (req.user.tipo === 'aluno') {
    const resposta = {
      id_aluno: req.user.id,
      id_exercicios: req.params.id_exercicio,
      id_sala: req.params.id_sala,
      file_name: '',
      resposta: req.body.resposta,
    };

    const ejs = {
      sala: req.params.id_sala,
      lista: req.params.id_lista,
    };

    const exercise = new ExercicioDao();
    const result = await exercise.updateAwnser(resposta);
    ejs.file_name = result;

    res.redirect(`/turmas/abrir/listas/${ejs.sala}/${ejs.lista}`);
  } else {
    next();
  }
});
