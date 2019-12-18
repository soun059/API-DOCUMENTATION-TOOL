module.exports = function (mongo, ObjectID, url, assert, dbb, db) {
   
    var edit_project_module = {
         
        // Start of edit_project
        edit_project: function (project_id, project_name, callBack) {
            try {
                db.db().collection(dbb.PROJECTS).updateOne({
                    "_id": new ObjectID(project_id)
                }, {
                    $set: {
                        "project_name": project_name
                    }
                }, {
                    upsert: false
                }, function (err, result) {
                    if (err) {
                        callBack(null, true, "Error occured while editing the project");
                    } else {
                        if (result.modifiedCount)
                            callBack(result, false, "Project edited successfully!");
                        else 
                            callBack(result, true, "Project cannot be edited");
                    }     
                });
            } catch (error) {
                callBack(null, true, "Error in editing project details")
            }
        }
        // End of edit_project
    }

    return edit_project_module;
}