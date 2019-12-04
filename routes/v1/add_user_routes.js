module.exports = {
  configure: function(app, mongo, ObjectID, url, assert, dbb, db) {
    var add_user_module = require("../../models/v1/add_user_module")(
      mongo,
      ObjectID,
      url,
      assert,
      dbb,
      db
    );

    // API Add User
    // headers: user_token
    // params: name, email, password
    // Functions: verify_user_details, add_user
    // Response: result, error, message
    app.post("/add_user", function(req, res) {
      try {
        // Token sent through header from client
        let client_token =
          req.headers["x-access-token"] || req.headers["authorization"];
        if (client_token) {
          if (
            req.body.hasOwnProperty("name") &&
            req.body.hasOwnProperty("email") &&
            req.body.hasOwnProperty("password")
          ) {
            // Verify the JWT Token
            add_user_module.verify_user_details(client_token, function(
              result,
              error,
              message
            ) {
              if (error) {
                res.json({
                  status: false,
                  message: message
                });
              } else {
                // If token is verified successfully, then add a user (result contains the id of the client)
                let new_user = {
                  name: req.body.name,
                  email: req.body.email,
                  password: req.body.password,
                  active: true,
                  user_token: "",
                  created_on: new Date(),
                  created_by: result
                };

                // Add the user
                add_user_module.add_user(new_user, function(
                  result,
                  error,
                  message
                ) {
                  if (error) {
                    res.json({
                      status: false,
                      message: message
                    });
                  } else {
                    // Send the email to the added user
                    add_user_module.send_mail(req.body.name, req.body.email, function(
                      result,
                      error,
                      message
                    ) {
                      if (error) {
                        res.json({
                          status: false,
                          message: message
                        });
                      } else {
                        res.json({
                          status: true,
                          message: message
                        });
                      }
                    });
                  }
                });
              }
            });
          } else {
            if (req.body.hasOwnProperty("name") == false) {
              res.json({
                status: false,
                message: "name parameter is missing"
              });
            } else if (req.body.hasOwnProperty("email") == false) {
              res.json({
                status: false,
                message: "email parameter is missing"
              });
            } else if (req.body.hasOwnProperty("password") == false) {
              res.json({
                status: false,
                message: "password parameter is missing"
              });
            }
          }
        } else {
          res.json({
            status: false,
            message: "user_token is missing"
          });
        }
      } catch (error) {
        res.json({
          status: false,
          message: error
        });
      }
    });
  }
};
