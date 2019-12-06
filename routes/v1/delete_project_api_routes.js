module.exports = {
    configure: function (app, mongo, ObjectID, url, assert, dbb, db) {
        var add_user_module = require('../../models/v1/add_user_module')(mongo, ObjectID, url, assert, dbb, db);
        var delete_project_api_module = require('../../models/v1/delete_project_api_module')(mongo, ObjectID, url, assert, dbb, db);
        
        // API Delete Project API
        // headers: user_token
        // params: api_id
        // Functions: verify_user_details, delete_project_api
        // Response: status, message
        app.post('/delete_project_api', function (req, res) {
            try {
                let user_token = req.headers['x-access-token'] || req.headers['authorization'];
                if (user_token) {
                    if (req.body.hasOwnProperty("api_id")) {
                       // Verify the token
                        add_user_module.verify_user_details(user_token, function (result, error, message) {
                            if (error) {
                                res.json({
                                    status: false,
                                    message: message
                                });
                            } else {
                                // token is verified, hence delete the project api
                                delete_project_api_module.delete_project_api(req.body.api_id, result, function (result, error, message) {
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
                       }) 
                    } else {
                        if (req.body.hasOwnProperty("api_id") == false) {
                            res.json({
                                status: false,
                                message: "api_id parameter is missing"
                            });
                        }
                   }
                } else {
                    res.json({
                        status: false,
                        message: "user_token parameter is missing"
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
}