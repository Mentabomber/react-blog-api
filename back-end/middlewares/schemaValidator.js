const { validationResult, checkSchema } = require("express-validator");

function checkValidity(req, res, next) {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(422).json(validation.array());
  }

  next();
}

/**
 * Metodo che ritorna un array di middleware per la validazione dello schema
 * @param {*} schema
 * @returns
 */
module.exports = function (schema) {
  return [
    // middleware che controlla lo schema
    checkSchema(schema),
    // middleware che controlla se ci sono errori di validazione
    checkValidity,
  ];
};

module.exports.checkValidity = checkValidity;