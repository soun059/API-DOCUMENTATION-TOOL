// REQURE
const passport = require('passport');
const passportServiceGitHub = require('../../services/github_passport');
const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = {
    configure: function (app, mongo, ObjectID, url, assert, dbb, db) {
        const add_user_module = require('../../models/v1/add_user_module')(module, ObjectID, url, assert, dbb, db);

        // Passport middleware 
        app.use(passport.initialize());

        // GitHub Login
        app.get('/auth/github', passport.authenticate('github', {
            scope: ['profile', 'email']
        }));

        // GitHub CallBack
        app.get('/auth/github/redirect', passport.authenticate('github', { session: false }), (req, res) => {
          //  console.log(req.user._json);
            const new_user = {
                githubID: req.user.id,
                name: req.user.displayName,
                email: req.user._json.email,
                type: "github_account",
                active: true,
            };

            add_user_module.check_existing_github_user(req.user.id, function (result, error, message) {
                if (error) {
                    // User exits, so no need to add the user to database, but generate the jwt token and send it back
                //    console.log(result)
                    const token = jwt.sign(
                        { data: result },
                        config.get("secret"),
                        {
                            expiresIn: 604800 // 1 week
                        }
                    );
                    res.json({
                        status: true,
                        message: "Login Successful",
                        token: "Bearer " + token
                    })
                } else {
                    // User does not exists so create a new one and then send the jwt token
                    add_user_module.add_user(new_user, function (result, error, message) {
                        if (error) {
                            res.json({
                                status: false,
                                message: message
                            });
                        } else {
                            // Create the jwt token
                    //        console.log(result)
                            const token = jwt.sign(
                                { data: result.ops },
                                config.get("secret"),
                                {
                                    expiresIn: 604800 // 1 week
                                }
                            );

                            res.json({
                                status: true,
                                message: "Login Successful",
                                token: "Bearer " + token
                            }); 
                        }
                    });
                }
            }); 
        });
    }
}