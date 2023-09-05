import express from "express";
import session from "express-session";
import index from './routes/index.js';
import articles from "./routes/articles.js";
import usersRouter from './routes/users.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "aksdujgqjhsgada",
    resave: false,
    saveUninitialized: true
}));
const router = express.Router()
app.use(router);
router.use("/", index);
router.use("/articles", articles);
router.use("/users", usersRouter);

app.listen(3000, () => {
    console.log("API it's running!");
})
