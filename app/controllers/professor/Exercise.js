const verificarProfessor = require('../../middlewares/VerificarProfessor');
const asyncHandler = require('../../middlewares/async');
const ExercicioDao = require('../../infra/banco/ExercicioDao');
const s3AwsUpload = require('../../infra/aws/s3Upload')();
const s3AwsDownload = require('../../infra/aws/s3Download')();
const s3AwsDelete = require('../../infra/aws/s3Delete')();
const { getDisplayName } = require('../../utils/getDisplayName');
const fs = require('fs');

// @Turmas
exports.getExercises = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const entrada = {
      id_professor: req.user.id,
    };

    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
    };

    const exercises = new ExercicioDao();
    const result = await exercises.list(entrada);

    ejs.listaExercicios = result;

    res.render('professor/perfil/exercicios/exercicios', ejs);
  });
});

exports.getCreateExercises = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
    };
    res.render('professor/perfil/exercicios/criarExercicios', ejs);
  });
});

exports.postCreateExercises = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const exerciseDescription = {
      id_professor: req.user.id,
      titulo: req.body.titulo,
      descricao: req.body.descricao,
    };

    const exercises = new ExercicioDao();
    const result = await exercises.create(exerciseDescription);
    const { files } = req;

    const promiseList = [];

    files.forEach((element) => {
      const returnPromise = new Promise(async (resolve) => {
        const uploadData = await s3AwsUpload(element, req.user.email);
        const exerciseData = { id: result.insertId, file_name: uploadData };
        const materialExercises = new ExercicioDao();
        await materialExercises.addMaterial(exerciseData);
        resolve();
      });
      promiseList.push(returnPromise);
    });

    await Promise.all(promiseList);

    res.redirect('/professor/exercicios');
  });
});

exports.openExercise = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const teacherData = [{ id: req.params.id }, { id_professor: req.user.id }];

    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
    };

    const exercises = new ExercicioDao();
    const result = await exercises.list(teacherData);

    if (result.length === 0) {
      res.render('erro/403', ejs);
    } else {
      ejs.questao = result;

      const files = new ExercicioDao();
      let fileNames = await files.downloadPaths({ id: result[0].id });

      fileNames = getDisplayName(fileNames);

      ejs.paths = fileNames;
      res.render('professor/perfil/exercicios/abrirExercicio', ejs);
    }
  });
});

exports.downloadExercice = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const entrada = [req.params.id_exercicio, req.params.file_name];

    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
    };

    const exercises = new ExercicioDao();
    const downloadFilesName = await exercises.download(entrada);

    const file = await s3AwsDownload(downloadFilesName[0].file_name);

    if (downloadFilesName.length === 0) {
      res.render('erro/403', ejs);
    } else {
      res.redirect(file);
    }
  });
});

exports.deleteExercise = asyncHandler(async (req, res, next) => {
  verificarProfessor(req, next, async () => {
    const entrada = { id: req.params.id };

    const fileNames = new ExercicioDao();
    const downloadFilesName = await fileNames.downloadPaths(entrada);

    const nominalNames = getDisplayName(downloadFilesName);

    await s3AwsDelete(downloadFilesName);

    nominalNames.forEach((file) => {
      const path = `app/uploads/${file.displayName}`;
      if (fs.existsSync(path)) fs.unlinkSync(path);
    });

    const exercise = new ExercicioDao();
    await exercise.delete(entrada);

    res.redirect('/professor/exercicios');
  });
});
