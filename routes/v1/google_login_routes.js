// REQURE
const passport = require('passport');
const passportService = require('../../services/google_passport');
const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = {
    configure: function (app, mongo, ObjectID, url, assert, dbb, db) {
        const add_user_module = require('../../models/v1/add_user_module')(module, ObjectID, url, assert, dbb, db);

       // Passport middleware 
       app.use(passport.initialize());
        // Google Login
        app.get('/auth/google', passport.authenticate('google', {
            scope: ['profile', 'email']
        }));

        // CallBack URL for Google login
        app.get('/auth/google/redirect', passport.authenticate('google', { session: false }), (req, res) => {
            //  console.log(req.user)
            // Save the user to database
            const new_user = {
                googleID: req.user.id,
                name: req.user.displayName,
                email: req.user.emails[0].value,
                type: "google_account",
                active: true,
            };

            add_user_module.check_existing_google_user(req.user.id, function (result, error, message) {
                if (error) {
                    res.json({
                        status: false,
                        message: message
                    })
                } else {
                    // User does not exists so create a new one
                    add_user_module.add_user(new_user, function (result, error, message) {
                        if (error) {
                            res.json({
                                status: false,
                                message: message
                            });
                        } else {
                            // Create the jwt token
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