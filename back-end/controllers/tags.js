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

async function showAllTags(req, res){

  const allTags = await prisma.tag
  .findMany({
    
  })
  
  console.log(allTags);
  return res.json(allTags);

}


module.exports = {
  store,
  showAllTags
} 