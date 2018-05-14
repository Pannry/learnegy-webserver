module.exports = (app) => {
  const notas = {
    professorGET: (req, res) => {
      if (req.user.tipo === 'professor') {
        const entrada = {
          id_sala: req.params.id_sala,
          id_aluno: req.params.id_aluno,
        };

        const ejs = {
          user: req.user,
          page_name: req.path,
          accountType: req.user.tipo,
          id_sala: req.params.id_sala,
          id_aluno: req.params.id_aluno,
        };

        const conexaoDb1 = app.infra.banco.dbConnection();
        const NotasDAO1 = new app.infra.banco.NotasDAO(conexaoDb1);

        NotasDAO1.selecionarListas(entrada.id_sala, (err, resultado1) => {
          if (err) throw err;
          ejs.lista = resultado1;

          ejs.lista.forEach((element) => {
            const criarNotas = entrada;
            criarNotas.id_lista = element.id_lista;

            const conexaoDb3 = app.infra.banco.dbConnection();
            const NotasDAO3 = new app.infra.banco.NotasDAO(conexaoDb3);

            NotasDAO3.criarNotaAlunoSala(criarNotas, () => { });

            conexaoDb3.end();
          });

          const conexaoDb2 = app.infra.banco.dbConnection();
          const NotasDAO2 = new app.infra.banco.NotasDAO(conexaoDb2);

          NotasDAO2.mostrarNotaAlunoSala(entrada, (err2, resultado2) => {
            if (err2) throw err2;
            ejs.notas = resultado2;
            res.render('professor/perfil/notas/AbrirNotasAluno', ejs);
          });
          conexaoDb2.end();
        });
        conexaoDb1.end();
      }
    },

    post: (req, res) => {
      if (req.user.tipo === 'professor') {
        const entrada = {
          id_sala: req.params.id_sala,
          id_aluno: req.params.id_aluno,
          id_lista: req.params.id_lista,
        };
        const ejs = {
          sala: req.params.id_sala,
          aluno: req.params.id_aluno,
          nota: req.body.nota,
        };

        entrada.nota = req.body.nota;

        const conexaoDb1 = app.infra.banco.dbConnection();
        const NotasDAO1 = new app.infra.banco.NotasDAO(conexaoDb1);

        NotasDAO1.atualizarNota(entrada, (err) => {
          if (err) {
            // Tratar o erro 1062 algum dia...
            if (err.code !== 'WARN_DATA_TRUNCATED') throw err;
          }
          res.redirect(`/professor/turma/abrir/${ejs.sala}/professor/${ejs.aluno}`);
        });

        conexaoDb1.end();
      }
    },

    verRespostas: (req, res) => {
      if (req.user.tipo === 'professor') {
        const entrada = {
          id_aluno: req.params.id_aluno,
          id_lista: req.params.id_lista,
          id_sala: req.params.id_sala,
        };
        const ejs = {
          user: req.user,
          page_name: req.path,
          accountType: req.user.tipo,
        };

        const conexaoDb = app.infra.banco.dbConnection();
        const NotasDAO = new app.infra.banco.NotasDAO(conexaoDb);

        NotasDAO.MostrarRespostas(entrada, (err, resultado) => {
          if (err) throw err;
          ejs.respostas = resultado;
          res.render('professor/perfil/notas/mostrarExerciciosLista', ejs);
        });
        conexaoDb.end();
      }
    },
  };
  return notas;
};