 var http = require('http');

//require imports a file as a module so that we can use it. In this case we get access to the express 
//libraries
var express = require('express');

//require express handlebars
var exphbs  = require('express3-handlebars');


// Mongoose import
var mongoose = require('mongoose');
//Connection string to our MongoDB
var connectionString = 'mongodb://JETReadOnlyUser3:JETReadOnlyUser3@ds041157.mongolab.com:41157/JETMongoDB';
// Connect to MongoDB
mongoose.connect(connectionString, function (error) {
    if (error) {
        console.log(error);
    }
    else {
        console.log("Connected to " + connectionString);
    }
});


// Mongoose Schema definition
var Schema = mongoose.Schema;
var EmployeeSchema = new Schema({
    first_name: String,
    last_name: String,
    company: String,
    title:String,
    location:String
});

//Mongoose Model definition
//Important - Since we defined our collection in Mongoose DB directly
//We need to add a third argument explicilty defining the collection to map too
//otherwise it would assume the collection name is 'employees'
var Employee = mongoose.model('Employee', EmployeeSchema,"Employee");

//Call express as a function which will return an application object 
var application = express();

application.use(express.static(__dirname + '/public'));

//Configure default layout to be at /views/layouts/main.handlebars
application.engine('handlebars', exphbs({defaultLayout: 'main'}));

//Set view engine to be handlebars
application.set('view engine', 'handlebars');

//Use
var bodyParser     = require('body-parser');
application.use(bodyParser());

//Use the application object to do something on an HTTP GET request.
application.get("/Handlebars", function (req, res) {
    //Query MongoDB for a list of employees
    Employee.find({}, function (err, docs) {
        if (err) {
            throw Error;
        }
        res.render("home", { employees: docs });

    });
})     


//API Routes
//Get all Employees
application.get('/api/employees', function(req, res) {

        // use mongoose to get all todos in the database
        Employee.find(function(err, emps) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(emps); // return all todos in JSON format
        });
    });

 // create an employee and send back all emoloyees after creation
    application.post('/api/employees', function (req, res) {

        console.log("Request body is: " + req.body);

        // create an Employee, information comes from AJAX request from Angular
        Employee.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            company: req.body.company,
            title: req.body.title,
            location: req.body.location
        }, function (err, employee) {
            if (err)
                res.send(err);

            // get and return all the Employees after you create another
            Employee.find(function (err, emps) {
                if (err)
                    res.send(err)
                res.json(emps);
            });
        });

    });

// Our one page angular version of this site
application.get("/Angular", function (req, res) {
    res.sendfile('./public/index.html');
})     

                                                                                                                                                                                         
//Create the Web Server passing the application object. 
var server = http.createServer(application ) 
// Make sure server is listening on port 8080. 
server.listen(process.env.PORT || 8080);