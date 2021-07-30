const verificarAluno = require('../../middlewares/VerificarAluno');
const asyncHandler = require('../../middlewares/async');
const DidaticoDAO = require('../../infra/banco/DidaticoDAO');
const s3AwsDownload = require('../../infra/aws/s3Download')();
const { getDisplayName } = require('../../utils/getDisplayName');

exports.donwloadDidactic = asyncHandler(async (req, res, next) => {
  verificarAluno(req, next, async () => {
    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
    };

    const didactic = new DidaticoDAO();
    const result = await didactic.download(req.params.path);

    const file = await s3AwsDownload(result[0].file_name);

    if (result.length === 0) {
      res.render('erro/403', ejs);
    } else {
      res.redirect(file);
    }
  });
});

exports.listDidactic = asyncHandler(async (req, res, next) => {
  verificarAluno(req, next, async () => {
    const ejs = {
      user: req.user,
      page_name: req.path,
      accountType: req.user.tipo,
      sala: req.params.id_sala,
      didatico: req.params.id_didatico,
    };

    const entrada = {
      id_didatico: req.params.id_didatico,
    };

    let didactic = new DidaticoDAO();
    let result = await didactic.list({ id: entrada.id_didatico });

    ejs.didatico = result;

    didactic = new DidaticoDAO();
    result = await didactic.downloadPaths(result[0].id);
    result = getDisplayName(result);
    ejs.paths = result;

    res.render('aluno/perfil/didatico/abrirDidaticoAluno', ejs);
  });
});
