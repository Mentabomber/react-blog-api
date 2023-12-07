const AuthError = require("../exceptions/AuthError");

/**
 * Racchiudo il middleware in una funzione che riceve un argomento.
 * Quest'argomento lo uso nel middleware del return per fare il controllo sul ruolo
 * @param {*} role 
 * @returns 
 */
module.exports = function (role) {
  return function (req, res, next) {
    if (req.user.role !== role) {
      throw new AuthError("Non hai i permessi per accedere a questa risorsa");
    }

    next();
  };
};