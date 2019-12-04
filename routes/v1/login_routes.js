module.exports = {
    configure: function (app, mongo, ObjectID, url, assert, dbb, db) {
        var login_module = require('../../models/v1/login_module')(mongo, ObjectID, url, assert, dbb, db);
        
        // API Login User
        // headers:
        // params: email, password
        // Functions: login_user
        // Response: result, error, message
        app.post('/login_user', function (req, res) {
            try {
                if (req.body.hasOwnProperty("email") && req.body.hasOwnProperty("password")) {
                    
                    login_module.login_user(req.body.email, req.body.password, function (result, error, message) {
                        if (error) {
                            res.json({
                                status: false,
                                message: message,
                            });
                        } else {
                            res.json({
                                status: true,
                                message: message,
                                user_token: result
                            });
                        }   
                    });

                } else {
                    if (req.body.hasOwnProperty("email") == false) {
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
            } catch (error) {
               
                res.json({
                    status: false,
                    message: error
                })
            }
        })
    }
}    