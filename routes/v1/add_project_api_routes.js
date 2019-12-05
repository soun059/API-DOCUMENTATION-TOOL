module.exports = {
    configure: function (app, mongo, ObjectID, url, assert, dbb, db) {
        var add_user_module = require('../../models/v1/add_user_module')(mongo, ObjectID, url, assert, dbb, db);
        var add_project_api_module = require('../../models/v1/add_project_api_module')(mongo, ObjectID, url, assert, dbb, db);

        // API Add Project API
        // headers: user_token
        // params: project_id
        // Functions: verify_user_details, delete_project
        // Response: status, message
        app.post('/add_project_api', function (req, res) {
             try {
                let user_token = req.headers['x-access-token'] || req.headers['authorization'];
                 if (user_token) {
                     if (req.body.hasOwnProperty("project_id") && req.body.hasOwnProperty("pathname") && req.body.hasOwnProperty("params") && req.body.hasOwnProperty("response")) {
                    // Verify user_token
                     add_user_module.verify_user_details(user_token, function (result, error, message) {
                        if (error) {
                            res.json({
                                status: false,
                                message: message
                            });
                        } else {
                            // token is verified, hence add the project api
                            const project_details = {
                                project_id: req.body.project_id,
                                pathname: req.body.pathname,
                                params: req.body.params,
                                response: req.body.response,
                                active: true,
                                created_on: new Date(),
                                created_by: result
                            };
                            add_project_api_module.add_project_api(project_details, function (result, error, message) {
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
                         } else if (req.body.hasOwnProperty("pathname") == false) {
                            res.json({
                                status: false,
                                message: "pathname parameter is missing"
                            });   
                         } else if (req.body.hasOwnProperty("params") == false) {
                            res.json({
                                status: false,
                                message: "params parameter is missing"
                            });
                         } else if (req.body.hasOwnProperty("response") == false) {
                            res.json({
                                status: false,
                                message: "response parameter is missing"
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