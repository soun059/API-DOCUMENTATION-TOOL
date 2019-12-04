module.exports = {
    configure: function (app, mongo, ObjectID, url, assert, dbb, db) {
        var add_user_module = require('../../models/v1/add_user_module')(mongo, ObjectID, url, assert, dbb, db);
        var create_project_module = require('../../models/v1/create_project_module')(mongo, ObjectID, url, add_user_module, dbb, db);

        // API Create Project
        // headers: user_token
        // params: project_name
        // Functions: verify_user_details, create_project
        // Response: status, message
        app.post('/create_project', function (req, res) {
            try {

                // Token sent through header from client
                let user_token = req.headers['x-access-token'] || req.headers['authorization'];
                if (user_token) {
                    if (req.body.hasOwnProperty("project_name")) {
                        // Verify the user token
                        add_user_module.verify_user_details(user_token, function (result, error, message) {
                            if (error) {
                                res.json({
                                    status: false,
                                    message: message
                                });
                            } else {
                                // Token is verified, hence create the project
                                const project_details = {
                                    project_name: req.body.project_name,
                                    active: true,
                                    created_on: new Date(),
                                    created_by: result
                                };

                                create_project_module.create_project(project_details, function (result, error, message) {
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
                        res.json({
                            status: false,
                            message: "project_name parameter is missing"
                        });
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