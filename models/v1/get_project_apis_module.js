module.exports = function (mongo, ObjectID, url, assert, dbb, db) {
    var get_project_apis_module = {

        get_project_apis: function (project_id, user_id, callBack) {
            try {
                db.db().collection(dbb.PROJECT_APIS).find({
                    "project_id": project_id,
                    "active": true,
                    "created_by": user_id
                }).toArray((err, response) => {
                    if (err) {
                        callBack(null, true, "No Project APIs found");
                    } else {
                        if (response.length > 0)
                            callBack(response, false, "Project APIs found");
                        else
                            callBack(null, false, "No project APIs found");
                    }
                });
            } catch (error) {
                callBack(null, true, "Error occured while fetching project apis");
            }
        }
    }
    return get_project_apis_module;
}