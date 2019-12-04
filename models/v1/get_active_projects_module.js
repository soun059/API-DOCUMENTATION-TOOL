module.exports = function (mongo, ObjectID, url, assert, dbb, db) {
    var get_all_active_projects_module = {
           
        get_all_active_projects: function (user_id, callBack) {
            try {
                db.db().collection(dbb.PROJECTS).find({
                    "created_by": user_id,
                    "active": true 
                }).toArray((err, response) => {
                    if (err) {
                        callBack(null, true, "Error occured while getting all the active projects");
                    } else {
                        if (response.length > 0)
                            callBack(response, false, "Active projects found!");
                        else
                            callBack(null, false, "No projects found!");
                    }
               })   
            } catch (error) {
                res.json({
                    success: false,
                    message: error
                });
            }
        }
    }

    return get_all_active_projects_module;
} 