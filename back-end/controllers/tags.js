const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

async function store(req, res){
  const inputData = req.body;

  const newTag = await prisma.tag.create({
    data: {
      type: inputData.type,
    }
  })

  return res.json(newTag);
}


module.exports = {
  store
} 