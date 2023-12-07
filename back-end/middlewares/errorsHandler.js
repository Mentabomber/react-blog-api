module.exports = function (err, req, res, next) {
    console.log(err);
  
    sendRes(err, res);
  };
  
  /**
   * Per poter usare la stessa risposta anche nel middleware per le rotte non trovate
   * esporto questa funzione in modo da poterla riutilizzare
   * 
   * @param {*} err 
   * @param {*} res 
   * @returns 
   */
  function sendRes(err, res) {
    return res.status(err.status ?? 500).json({
      message: err.message,
      error: err.constructor.name,
      errors: err.errors ?? [],
    });
  }
  
  module.exports.sendRes = sendRes;