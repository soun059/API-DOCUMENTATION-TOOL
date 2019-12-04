module.exports = function (mongo, ObjectID, url, assert, dbb, db) {
   
    var create_project_module = {
    
        // Start of create_project
        create_project: function (project_details, callBack) {
            try {
                db.db().collection(dbb.PROJECTS).insertOne(project_details, (err, response) => {
                    if (err) {
                        callBack(null, true, "Error occured in creating project");
                    } else {
                        callBack(null, false, "Project created successfully");
                    }
                });             
            } catch (error) {
                callBack(null, true, error);
            }
        }   
        // End of create_project
    }

    return create_project_module;
}    