import { Router } from "express";
import hash from 'object-hash'
import fs from 'fs';
import users from '../data/users.json' assert {type: "json"};
import bcrypt from 'bcrypt';
import { __dirname } from "../app.js";
import authenticator from "../middlewares/authenticator.js";
const app = Router();

app.get("/:user", (req, res) => {
    const user = users.filter(u => u.author_user == req.params.user)[0];
    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }
    return res.status(200).json({ user });
})

app.post("/create", authenticator, (req, res) => {
    const user = users.filter(u => u.author_email == req.body.email)[0];
    if (user) {
        return res.status(409).json({ message: "Email já cadastrado" });
    }
    const { name, email, pwd } = req.body;
    const username = email.split("@")[0];
    const pwd_encrypt = bcrypt.hashSync(pwd, 10);
    const new_user = {
        author_id: hash({ name, email }),
        author_name: name,
        author_email: email,
        author_user: username,
        author_pwd: pwd_encrypt,
        author_level: "admin",
        author_status: true
    }

    users.push(new_user);
    fs.writeFileSync(__dirname + '\\data\\users.json', JSON.stringify(users));
    return res.status(201).json({ message: "Success", user: new_user });
});

app.put("/update", authenticator, (req, res) => {
    if (!req.body.id) {
        return res.status(400).json({ message: "Informe o ID!" });
    }
    const user = users.filter(u => u.id == req.body.id)[0];
    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }
    const { name, email, pwd } = req.body;
    let pwd_encrypt;
    let username;
    if (email) username = email.split("@")[0];
    if (pwd) pwd_encrypt = bcrypt.hashSync(pwd, 10);

    if (email) user.author_email = email;
    if (name) user.author_name = name;
    if (pwd) user.author_pwd = pwd_encrypt;
    if (email) user.author_user = username;
    const index = users.findIndex(u => u.author_id === user.author_id);
    users.splice(index, 0, user);
    fs.writeFileSync(__dirname + '\\data\\users.json', JSON.stringify(users));
    return res.status(204).send();
})

app.put("/activate/:id", authenticator, (req, res) => {
    const user = users.filter(u => u.id == req.params.id)[0];
    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }
    user.author_status = true;
    users.forEach(u => {
        if (u.author_id == user.author_id) {
            u = user;
        }
    });
    fs.writeFileSync(__dirname + '\\data\\users.json', JSON.stringify(users));
    return res.status(204).send();
})

app.delete("/:id", authenticator, (req, res) => {
    const user = users.filter(u => u.id == req.params.id)[0];
    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }
    user.author_status = false;
    const index = users.findIndex(u => u.author_id === user.author_id);
    users.splice(index, 0, user);
    fs.writeFileSync(__dirname + '\\data\\users.json', JSON.stringify(users));
    return res.status(204).send();

})

export default app;