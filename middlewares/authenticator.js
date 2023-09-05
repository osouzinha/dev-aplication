export default (req, res, next)=> {
    if(!req.session.user){
        return res.status(401).json({message: "Efetue Login"});
    }
    next();
}