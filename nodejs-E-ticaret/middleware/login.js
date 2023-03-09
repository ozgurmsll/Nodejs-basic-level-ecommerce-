const jwt = require("jsonwebtoken");
const config = require("config");

module.exports=(req,res,next) =>  {
    const token=req.header('x-auth-token');
    if (!token)
    return res.status(401).send('Access denied.');
    try {
    const decodedToken=jwt.verify(token,config.get("jwtPrivateKey"));
    req.user=decodedToken;
    next();
        
    } catch (error) {
        res.status(401).send('Invalid token');
    }

    
}

