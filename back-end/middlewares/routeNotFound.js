const NotFound = require("../exceptions/NotFound");
const { sendRes } = require("./errorsHandler");

module.exports = function (req, res, next) {
  console.log("Sono il middleware per la gestione delle rotte non trovate");
  sendRes(new NotFound("La rotta richiesta non è stata trovata"), res);
}