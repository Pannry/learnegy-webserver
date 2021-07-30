const dbConn = require('./dbConnection');

const ConnectionDatabase = dbConn();

function TurmaDao() { }

module.exports = TurmaDao;

TurmaDao.prototype.getConnection = async function () {
  this.conn = await new ConnectionDatabase();
};

TurmaDao.prototype.closeConnection = async function () {
  await this.conn.end();
  this.conn = undefined;
};

TurmaDao.prototype.execSQL = async function (sql, input) {
  await this.getConnection();
  const result = await this.conn.query(sql, input);
  this.closeConnection();
  return result[0];
};

// @Professor
TurmaDao.prototype.find = async function (input) {
  return this.execSQL('SELECT * FROM sala WHERE ?', input);
};

TurmaDao.prototype.create = function (input) {
  return this.execSQL('INSERT INTO sala SET ?', input);
};

TurmaDao.prototype.listarAlunos = function (input) {
  return this.execSQL(
    ` SELECT 
        id_aluno, id_sala, aluno_aceito, nome, email, instituicao_id 
      FROM 
        cursa, aluno 
      WHERE 
        cursa.id_aluno = aluno.id 
        AND ?`,
    input,
  );
};

// TODO: Testar a inclusao
TurmaDao.prototype.includeStudent = function (input) {
  return this.execSQL(
    ` UPDATE cursa SET aluno_aceito = 1 
      WHERE ? AND ?`,
    input,
  );
};

TurmaDao.prototype.editComment = function (input) {
  return this.execSQL('UPDATE sala SET ? WHERE ?', [input.com, input.id]);
};

TurmaDao.prototype.delete = function (input) {
  return this.execSQL('DELETE FROM sala WHERE ?', input);
};


/*
ALUNO
*/

TurmaDao.prototype.findStudent = function (input) {
  return this.execSQL(
    ` SELECT 
        id_aluno, id_sala, id, nome, semestre, comentario 
      FROM 
        cursa, sala 
      WHERE 
        id_sala = id 
        AND ?`,
    input,
  );
};

TurmaDao.prototype.verify = function (input) {
  return this.execSQL(
    ` SELECT * FROM cursa 
      WHERE ? AND ?`,
    input,
  );
};

TurmaDao.prototype.listTeacherClassrooms = function (input) {
  return this.execSQL(
    ` SELECT * 
      FROM sala 
      WHERE id_professor = ? and cod_sala = ?`,
    [input.id_professor, input.cod_sala],
  );
};

TurmaDao.prototype.applyToEnter = function (input) {
  return this.execSQL('INSERT INTO cursa SET ?', input);
};
