module.exports = function (mongo, ObjectID, url, assert, dbb, db) {
    var delete_project_api_module = {

        // Start of delete_project_api
        delete_project_api: function (api_id, user_id, callBack) {
            try {
                db.db().collection(dbb.PROJECT_APIS).deleteOne({
                    "_id": new ObjectID(api_id),
                    created_by: user_id
                }, function (err, response) {
                        if (err) {
                            callBack(null, true, "Error occured while deleting project API");
                        } else {
                            if (response.deletedCount) 
                                callBack(null, false, "Project API deleted successfully");
                            else 
                                callBack(null, true, "Project API cannot be deleted");
                     }     
                });
            } catch (error) {
                callBack(null, true, "Error occured while deleting project API");
            }
        } 
        // End of delete_project_api
    }
    
    return delete_project_api_module;
}