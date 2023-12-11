const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

async function kebabCase (slug){
    console.log(slug, "slug");
    let kebabCaseSlug = (slug.replace(/ /g, "-")).toLowerCase();
    console.log(kebabCaseSlug,"kebabCaseSlug");
    const showAllCategories = await prisma.category.findMany()
    console.log(showAllCategories, "array dei posts");
    // if true create new unique slug
    for (let index = 0; index <= showAllCategories.length; index++) {
        //creo nuovo slug
        console.log("entro");
        let nuovoSlug = kebabCaseSlug + (index === 0 ?  "" : `-${index}`); 
        console.log(kebabCaseSlug, " kebabCaseSlug", nuovoSlug, " nuovoSlug"); 
        // controllo se il nuovo slug esiste
        const slugExists = showAllCategories.some(existingSlug => existingSlug.slug === nuovoSlug);
        console.log(slugExists, index);
        
        // se si return
        if (!slugExists) {
            console.log("entro nell'if");
            console.log(kebabCaseSlug, " kebabCaseSlug", nuovoSlug, " nuovoSlug"); 
            return index === 0 ? kebabCaseSlug : nuovoSlug; 
        }
    }
    
}

async function store(req, res){
  const inputData = req.body;
  console.log(inputData.type);
  const sluggedType = await kebabCase(inputData.type);
  console.log(sluggedType, "sluggdType");
  const newCategory = await prisma.category.create({
    data: {
      type: inputData.type,
      slug: sluggedType
    }
  })

  return res.json(newCategory);
}

async function showAllCategories(req, res){

  const allCategories = await prisma.category
  .findMany({
    
  })
  
  console.log(allCategories);
  return res.json(allCategories);

}


module.exports = {
  store,
  showAllCategories
}
  
  