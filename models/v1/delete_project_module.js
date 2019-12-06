module.exports = function (mongo, ObjectID, url, assert, dbb, db) {

    var delete_project_module = {

        // Start of delete_project
        delete_project: function (project_id, callBack) {
            try {
                db.db().collection(dbb.PROJECTS).updateOne({
                    "_id": new ObjectID(project_id)
                }, {
                    $set: {
                        active: false
                    }
                }, {
                    upsert: false
                }, function (err, result) {
                    if (err) {
                        callBack(null, true, "Error occured while deleting the project");
                    } else {
                        if (result.modifiedCount)
                            callBack(result, false, "Project deleted successfully!");
                        else 
                            callBack(result, true, "Project cannot be deleted");
                    }
                });
            } catch (error) {
                callBack(null, true, "Error occcured while deleting the project");
            }
        }
        // End of delete_project
    }

    return delete_project_module;
}