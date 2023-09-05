import { Router } from "express";
import hash from 'object-hash'
import articles from '../data/articles.json' assert {type: "json"};
import authenticator from "../middlewares/authenticator";
const app = Router();

app.get("/:id", (req, res) => {
    const { id } = req.params;
    const article = articles.filter(a => a.kb_id == id)[0];
    if (!article) {
        return res.status(404).json({ message: "Article not found" });
    }
    return res.status(200).json({ article });
})

app.get("/most_liked", (req, res) => {
    const sortArticles = articles.sort((x, y) => x.kb_liked_count - y.kb_liked_count).slice(0,10);
    return res.status(200).json(sortArticles);
})

app.get("/featured", (req, res) => {
    const featured = articles.filter(a => a.kb_featured);
    return res.status(200).json(featured);
})

app.get("/keywords/:keyword", (req, res) => {
    const {keyword} = req.params;
    const res = articles.filter(a => a.kb_keywords == keyword);
    return res.status(200).json(res);
})

app.post("/create", authenticator,(req, res) => {
    const { title, body, permalink, keywords, liked_count } = req.body;

    const new_article = {
        kb_id: hash(title, body),
        kb_title: title,
        kb_body: body,
        kb_permalink: permalink,
        kb_keywords: keywords,
        kb_liked_count: liked_count,
        kb_published: true,
        kb_suggestion: false,
        kb_featured: false,
        kb_author_email: req.session.user.author_email,
        kb_published_date: new Date().toISOString().split("T")[0]
    }

    fs.writeFileSync(__dirname + '\\data\\articles.json', JSON.stringify(articles));
    return res.status(201).json({ message: "Success", article: new_article });
})

app.put("/update",authenticator, (req, res) => {
    const { id } = req.body;
    const article = articles.filter(a => a.kb_id == id)[0];
    if (!article) {
        return res.status(404).json({ message: "Article not found" });
    }
    const { title, body, permalink, keywords } = req.body;
    if (title) article.kb_title = title;
    if (body) article.kb_body = body;
    if (permalink) article.kb_permalink = permalink;
    if (keywords) article.kb_keywords = keywords;

    const index = articles.findIndex(a => a.kb_id === article.kb_id);
    articles.splice(index, 0, article);
    fs.writeFileSync(__dirname + '\\data\\users.json', JSON.stringify(articles));
    return res.status(204).send();
})

app.delete("/:id", authenticator,(req, res) => {
    const { id } = req.params;
    const article = articles.filter(a => a.kb_id == id)[0];
    if(!article){
        return res.status(404).json({message: "Article not found"});
    }
    const index = articles.findIndex(a => a.kb_id === article.kb_id);
    articles.splice(index, 0);
    fs.writeFileSync(__dirname + '\\data\\users.json', JSON.stringify(articles));
    return res.status(204).send();
})

export default app;