// REQUIRE
var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require('body-parser');
var cors = require('cors');
var ObjectID = require('mongodb').ObjectID;
var dbb = require('./config/collections');


// ROUTES
var login_routes = require('./routes/v1/login_routes');
var add_user_routes = require('./routes/v1/add_user_routes');
var create_project_routes = require('./routes/v1/create_project_routes');
var get_active_projects_routes = require('./routes/v1/get_active_projects_routes');
var delete_project_routes = require('./routes/v1/delete_project_route');
var add_project_api_routes = require('./routes/v1/add_project_api_routes');
var delete_project_api_routes = require('./routes/v1/delete_project_api_routes');
var get_project_apis_routes = require('./routes/v1/get_project_apis_routes');
var google_routes = require('./routes/v1/google_login_routes');
var github_login_routes = require('./routes/v1/github_login_routes');

// Configuring Port
app.set('port', (process.env.PORT || 8005));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    res.send('API Documentation Tool');
});


// APP On local machine 
var prod = true;
var url = "mongodb+srv://CShayan:1234@login-lhbsq.mongodb.net/apidocumentation?retryWrites=true&w=majority";
var db;

if (prod) {
    var prod_url = require('./config/database');
    url = prod_url;}

// Mongo Connection
mongo.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err, database) {
    assert.equal(null, err);
    db = database;

    // Configuring route
    login_routes.configure(app, mongo, ObjectID, url, assert, dbb, db);
    add_user_routes.configure(app, mongo, ObjectID, url, assert, dbb, db);
    create_project_routes.configure(app, mongo, ObjectID, url, assert, dbb, db);
    get_active_projects_routes.configure(app, mongo, ObjectID, url, assert, dbb, db);
    delete_project_routes.configure(app, mongo, ObjectID, url, assert, dbb, db);
    add_project_api_routes.configure(app, mongo, ObjectID, url, assert, dbb, db);
    delete_project_api_routes.configure(app, mongo, ObjectID, url, assert, dbb, db);
    get_project_apis_routes.configure(app, mongo, ObjectID, url, assert, dbb, db);
    google_routes.configure(app, mongo, ObjectID, url, assert, dbb, db);
    github_login_routes.configure(app, mongo, ObjectID, url, assert, dbb, db);

    app.listen(app.get('port'), function () {
        console.log('Node app is running on port', app.get('port'));
    });
})