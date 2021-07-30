function ProfessorModel(req) {
  this.id_professor = req.user.id || null;
  this.user = req.user || null;
  this.path = req.path || null;
  this.accountType = req.user.tipo || null;
}

ProfessorModel.prototype.getId = function () {
  return this.id_professor;
};

// ProfessorModel.prototype.equals = function (otherCat) {
//   return otherCat.getName() === this.getName()
//     && otherCat.getAge() === this.getAge();
// };

module.exports = ProfessorModel;
