const express = require("express");
const dotenv = require("dotenv");

//routes
const postsRouter = require("./routers/posts");
const categoriesRouter = require("./routers/categories");
const authRouter = require("./routers/auth");
const tagsRouter = require("./routers/tags");

//middlewares
const errorsHandlerMiddleware = require("./middlewares/errorsHandler");
const routeNotFoundMiddleware = require("./middlewares/routeNotFound");

const cors = require("cors");


dotenv.config();


const app = express();
const port = process.env.PORT || 3306;
app.use(cors());
app.use(express.json());


app.use("/posts", postsRouter);

app.use("/categories", categoriesRouter);

app.use("/tags", tagsRouter);

app.use("", authRouter);

app.use(errorsHandlerMiddleware);

app.use(routeNotFoundMiddleware);

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});