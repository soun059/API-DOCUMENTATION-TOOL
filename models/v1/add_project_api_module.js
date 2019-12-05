module.exports = function (mongo, ObjectID, url, assert, dbb, db) {
   
    var add_project_api = {
           
        // Start of add_project_api
        add_project_api: function (project_details, callBack) {
               try {
                db.db().collection(dbb.PROJECT_APIS).insertOne(project_details, function (err, response) {
                    if (err) {
                        callBack(null, true, "Error occured while adding project API");
                    } else {
                        callBack(response, false, "Project API added successfully");
                    } 
                });
               } catch (error) { 
                   callBack(null, true, "Error occured while adding project API");
               }    
        }   
        // End of add_project_api
    }
    return add_project_api;
}