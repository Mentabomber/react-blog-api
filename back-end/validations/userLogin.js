/**
 * @type {import("express-validator").Schema}
 */
module.exports = {
    email: {
      in: ["body"],
      isEmail: {
        errorMessage: "L'email inserita non è valida",
      },
      notEmpty: {
        options: {
          ignore_whitespace: true,
        },
        errorMessage: "L'email è obbligatoria",
      },
    },
    password: {
      in: ["body"],
      notEmpty: {
        options: {
          ignore_whitespace: true,
        },
        errorMessage: "La password è obbligatoria",
      },
    },
  };