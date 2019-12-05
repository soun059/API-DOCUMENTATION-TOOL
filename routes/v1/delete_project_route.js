module.exports = {
    configure: function (app, mongo, ObjectID, url, assert, dbb, db) {
        var add_user_module = require('../../models/v1/add_user_module')(mongo, ObjectID, url, assert, dbb, db);
        var delete_project_module = require('../../models/v1/delete_project_module')(mongo, ObjectID, url, assert, dbb, db);

        // API Delete Project
        // headers: user_token
        // params: project_id
        // Functions: verify_user_details, delete_project
        // Response: status, message
        app.post('/delete_project', function (req, res) {
            try {

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
                                // Token is verified successfully, so delete the project
                                delete_project_module.delete_project(req.body.project_id, function (result, error, message) {
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
                    } else {
                        if (req.body.hasOwnProperty("project_id") == false) {
                            res.json({
                                status: false,
                                message: "project_id parameter is missing"
                            });
                        }
                    }
                } else {
                    res.json({
                        status: false,
                        message: "user_token parameter is missing"
                    })
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