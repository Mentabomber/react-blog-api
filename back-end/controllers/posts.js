const { PrismaClient } = require("@prisma/client");
const { log } = require("util");
const prisma = new PrismaClient();


async function store(req, res){

    const creationData = req.body;

    const newPost = await prisma.post
    .create({
    data: 
    {
        title:creationData.title,
        slug: creationData.slug,
        image:creationData.image,
        content: creationData.content,
        published:creationData.published,
        category: {
            connect: {
                id: creationData.categoryId
            }
        },
        user: {
            connect: {
                id: creationData.userId
            }
        },
        tags:{
            connect: creationData.tags.map((idTag) => ({
            id: idTag,
        }))
        }
    }
    })
    .then((newPost) => {
    console.log("Nuovo post creato:", newPost);
    })
    .catch((error) => console.error(error));

    return res.json(newPost);
}


async function show(req, res){

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

    return res.json(showPost);
}
    
async function showAll(req, res){

        const showAllPosts = await prisma.post
        .findMany({
            include: {
                tags: {
                    select: {
                        type: true,
                    },
                },
                category: true,
                user: true,
            }
        })
        
        console.log(showAllPosts);
        return res.json(showAllPosts);

}

async function update(req, res){

    const postToUpdate = req.params;
    const dataToUpdate = req.body;

    const updatePost = await prisma.post
    .update({
        where: {
          slug: postToUpdate.slug,
        },
        data: {
            title:dataToUpdate.title,
            slug: dataToUpdate.slug,
            image:dataToUpdate.image,
            content: dataToUpdate.content,
            published:dataToUpdate.published,
        },
    })
    .then((updatedPost) => {
    console.log("Il post è stato modificato:", updatedPost);
    })
    .catch((error) => console.error(error));

    return res.json(updatePost);
}

async function destroy(req,res){

    const postToDelete = req.params;
    try {
        const deletePost = await prisma.post
        .delete({
        where: {
            slug: postToDelete.slug,
          },
        
        })
        return res.json(deletePost);
    } catch (error) {
        res.status(404).send("not found");
    }

   

    
}

module.exports = {
    store,
    show,
    showAll,
    update,
    destroy
  };

