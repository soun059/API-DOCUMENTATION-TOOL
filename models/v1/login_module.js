// REQUIRE
const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = function(mongo, ObjectID, url, assert, dbb, db) {
  var login_module = {
    
    // Start of login_user
    login_user: function(email, password, callBack) {
      try {
        db.db()
          .collection(dbb.USERDETAILS)
          .find({
            email: email,
            password: password
          })
          .toArray((err, response) => {
            if (err) {
              callBack(null, true, "Error occured");
            } else {
                if (response.length != 0) {
                    // If login successful, then create JWT token
                    const token = jwt.sign(
                        { data: response },
                        config.get("secret"),
                        {
                            expiresIn: 604800 // 1 week
                        }
                    );

                    callBack('Bearer ' + token, false, "Login Successful");
                } else {
                    callBack(null, true, "Email or password is incorrect");
                }
            }
          });
      } catch (error) {
        callBack(null, true, error);
      }
    }
    // End of login_user
  };

  return login_module;
};
