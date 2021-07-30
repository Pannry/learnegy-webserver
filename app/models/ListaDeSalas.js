function ListaDeSalas(input) {
  this.Salas = input || null;
}

ListaDeSalas.prototype.getLength = function () {
  return this.Salas.length;
};

ListaDeSalas.prototype.GetSalas = function () {
  return this.Salas;
};

module.exports = ListaDeSalas;
