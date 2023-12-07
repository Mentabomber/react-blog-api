
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const WrongUser = require("../exceptions/WrongUser");
const jsonwebtoken = require("jsonwebtoken");

/**
 *
 * @param {import("express").Request} req
 * @param {*} res
 * @param {*} next
 */
module.exports = async (req, res, next) => {

        const bearer = req.headers.authorization;
  
        const token = bearer.split(" ")[1];
        const user = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        const showInputData = req.params;
        const showPost = await prisma.post
        .findUnique({
            where: {
                slug: showInputData.slug,
            },
            include: {
                tags: {
                    select: {
                        type: true,
                    },
                },
                category: true,
                user: true,
            }

    });
    if (!showPost) {
        throw new Error("Not found");
    }


    if (!(showPost.user.id === user.id)) {
        throw new WrongUser(
        "Non puoi cancellare questo post perché non sei l'utente che lo ha creato"
    );
    }
    // Continue to the next middleware or route handler
    next();

};