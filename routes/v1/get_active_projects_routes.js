module.exports = {
    configure: function (app, mongo, ObjectID, url, assert, dbb, db) {
        var add_user_module = require('../../models/v1/add_user_module')(mongo, ObjectID, url, assert, dbb, db);
        var get_all_active_projects_module = require('../../models/v1/get_active_projects_module')(mongo, ObjectID, url, assert, dbb, db);

        // API Get All Active Projects
        // headers: user_token
        // params: 
        // Functions: 
        // Response: result, error, message

        app.post('/get_all_active_projects', function (req, res) {
            try {
               
               // Token sent through header from client
                let user_token = req.headers['x-access-token'] || req.headers['authorization'];
                if (user_token) {
                   
                    add_user_module.verify_user_details(user_token, function (result, error, message) {
                        if (error) {
                            res.json({
                                status: false,
                                message: message,
                            });
                        } else {
                            // Since token is verified now, get all the active projects
                            get_all_active_projects_module.get_all_active_projects(result, function (result, error, message) {
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