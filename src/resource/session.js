module.exports = {
  create: create,
  destroy: destroy
};

var json = require('../../lib/form-json');


function create(req,res) {
  json(req,res, function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    db.get("Select * from users where username=?", [username], function(user,err){
      if (err) {
        res.statusCode = 403
        res.end("Incorrect username/password");
      }
      if (!user)
      {
        //username not in database
        return;
      }
      var cryptedPassword = encryption.digest(password + user.salt)
      if (cryptedPassword != user.cryptedPassword) {

      }
      else{
        var cookieData = JSON.stringify({userId: user.id});
        var encryptedCookieData = encryption.encipher(cookieData);
        res.setHeader("Set-Cookie", ["session="+encryptedCookieData]);
        res.statusCode=200;
        res.end("Successful Login")
      }
    });

  })
}

function destroy(req, res) {
  res.setHeader("Set-Cookie","");
  res.statusCode=200;
  res.end("Looged out successfully")
}

function loginRequired(req,res, next) {
  var session = req.headers.cookie.session;
  var sessiondata = encryption.decipher(sessionData);
  var sessionObj = JSON.parse(sessionData);
  if (sessionObj.userId) {
    req.currentUserId = sessionObj.userId;
    return next(req,res);
  } else {
    res.statusCode = 403;
    res.end("Authentication required");
  }
}
