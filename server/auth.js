const isAuthenticated = (req,res,next)=>{
   console.log('Authentication Check:',{
    isAuthenticated: req.isAuthenticated(),
    user: req.user,
    session: req.session
   });

   if(req.isAuthenticated()){
    return next();
   }

   return res.status(401).json({
    message: 'Unauthorized',
    reason: 'No active session',
    details: {
      authenticated: req.isAuthenticated(),
      user: req.user ? 'User exists' : 'No user'
    }
  })
};

module.exports = isAuthenticated;