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
               }, {upsert: false}, function (err, result) {
                       if (err) {
                           callBack(null, true, "Error occured while deleting the project");
                       } else {
                           callBack(result, false, "Project deleted successfully!");
                       }
               });
           } catch (error) {
               res.json({
                   status: false,
                   message: error
               }); 
           }             
        }
        // End of delete_project
    }

    return delete_project_module;
}