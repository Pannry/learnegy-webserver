function Turmas(input) {
  this.nome = input.nome || null;
  this.semestre = input.semestre || null;
  this.comentario = '' || null;
  this.cod_sala = '' || null;
}

Turmas.prototype.InformacoesSala = function (professorId) {
  return {
    id_professor: professorId,
    nome: this.nome,
    semestre: this.semestre,
    cod_sala: this.cod_sala,
    comentario: this.comentario,
  };
};

Turmas.prototype.getCode = function () {
  return this.cod_sala;
};

Turmas.prototype.getComment = function () {
  return this.comentario;
};

Turmas.prototype.getNome = function () {
  return this.nome;
};

Turmas.prototype.getSemestre = function () {
  return this.semestre;
};

Turmas.prototype.setCode = function (value) {
  this.cod_sala = value;
};

Turmas.prototype.setComment = function (value) {
  this.comentario = value;
};

module.exports = Turmas;
