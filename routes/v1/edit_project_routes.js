module.exports = {
    configure: function (app, mongo, ObjectID, url, assert, dbb, db) {
        var add_user_module = require('../../models/v1/add_user_module')(mongo, ObjectID, url, assert, dbb, db);
        var edit_project_module = require('../../models/v1/edit_project_module')(mongo, ObjectID, url, assert, dbb, db);
          

        // API Edit Project API
        // headers: user_token
        // params: project_id, project_name
        // Functions: 
        // Response: status, message, result
        app.post('/edit_project', function (req, res) {
           try {
               let user_token = req.headers['x-access-token'] || req.headers['authorization'];
               if (user_token) {
                   if (req.body.hasOwnProperty("project_id") && req.body.hasOwnProperty("project_name")) {
                      // Verify the token
                       add_user_module.verify_user_details(user_token, function (result, error, message) {
                           if (error) {
                            res.json({
                                status: false,
                                message: message
                            });
                           } else {
                              // token is verified, hence edit the project
                               edit_project_module.edit_project(req.body.project_id, req.body.project_name, function (result, error, message) {
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
                       if (req.body.hasOwnProperty("project_id") == false) {
                        res.json({
                            status: false,
                            message: "project_id parameter is missing"
                        });
                       } else if (req.body.hasOwnProperty("project_name") == false) {
                        res.json({
                            status: false,
                            message: "project_name parameter is missing"
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