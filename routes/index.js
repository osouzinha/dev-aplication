import {Router} from "express";
import users from '../data/users.json' assert {type: "json"};
import bcrypt from 'bcrypt'
const app = Router();

app.post("/login", async (req, res) => {
    const user = users.filter(u => u.author_user == req.body.user && bcrypt.compareSync(req.body.pwd, u.author_pwd))[0];
    if (user) {
        req.session.user = user;
        return res.status(200).json({ message: "Success", user });
    }
    return res.status(401).json({ message: "Credenciais inválidas!" });
})


export default app;