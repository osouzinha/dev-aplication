export default (req, res, next)=> {
    if(!req.session.user){
        return res.status(401).json({message: "Efetue Login!"});
    }
    if(!req.session.user.admin){
        return res.status(401).json({message: "Você não pode efetuar esta ação!"});
    }
    next();
}