module.exports = {
    configure: function (app, mongo, ObjectID, url, assert, dbb, db) {
        var add_user_module = require('../../models/v1/add_user_module')(mongo, ObjectID, url, assert, dbb, db);
        var get_project_apis_module = require('../../models/v1/get_project_apis_module')(mongo, ObjectID, url, assert, dbb, db);

        // API Get Project APIs
        // headers: user_token
        // params: project_id
        // Functions: verify_user_details, get_project_apis
        // Response: status, message, result
        app.post('/get_project_apis', function (req, res) {
            // Token sent through header from client
            let user_token = req.headers['x-access-token'] || req.headers['authorization'];
            if (user_token) {
                if (req.body.hasOwnProperty("project_id")) {
                    // Verify the user_token
                    add_user_module.verify_user_details(user_token, function (result, error, message) {
                        if (error) {
                            res.json({
                                status: false,
                                message: message
                            }); 
                        } else {
                            // Token is verified, so find the active projects
                            get_project_apis_module.get_project_apis(req.body.project_id, result, function (result, error, message) {
                                if (error) {
                                    res.json({
                                        status: false,
                                        message: message
                                    });
                                } else {
                                    res.json({
                                        status: true,
                                        message: message,
                                        result: result
                                    });
                                }
                            });
                        }
                    });

                } else {
                    if (req.body.hasOwnProperty("project_id") == false) {
                        res.json({
                            status: false,
                            message: "project_id parameter is missing"
                        })
                    }
                }
            } else {
                res.json({
                    status: false,
                    message: "user_token header is missing"
                });
            }
        });
    }
}