var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

var mongoose = require('mongoose');
var mongoUri = "mongodb://localhost:27017/student";
mongoose.connect(mongoUri);
mongoose.connection.once('open', function () {
  console.log("MONGO!!!");
});

/*
These are the fields (star means required) ...
* First Name
* Last Name
* Department
  School
* Email
* Phone
  Comments
* Verification (enter any two digits with no spaces (Example: 12)
*/
var Schema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  department: { type: String, required: true },
  school: { type: String, required: false },
  eMail: { type: String, required: true },
  phone: { type: Number, required: true },
  comments: { type: String, required: false, maxlength: 500 },
  verification: { type: Number, required: true, maxlength: 2 }
});

var student = mongoose.model('stdnt', Schema);

var router = express.Router();
router.get("/", function(req, res){
    res.json({"error": false, "message": "Hello World"});
});

router.route("/students")
.get(function(req, res){
  var response = {};
  student.find({},function(err, data){
    if(err) {
      response = {"error": true, "message": "Error fetching data"};
    } else {
      response = {"error": false, "message": data};
    }
    res.json(response);
  });
})
.post(function(req, res){
  var db = new student();
  var response = {};
  db.firstName = req.body.firstName;
  db.lastName =  req.body.lastName;
  db.department =  req.body.department;
  db.school =  req.body.school;
  db.eMail =  req.body.eMail;
  db.phone =  req.body.phone;
  db.comments =  req.body.comments;
  db.verification =  req.body.verification;
  db.save(function(err){
        // save() will add new data in collection.
        if(err) {
          response = {"error": true, "message": "Error adding data"};
        } else {
          response = {"error": false, "message": "Data added"};
        }
        res.json(response);
      });
    });

router.route("/students/:id")
.get(function(req, res){
  var response = {};
  student.findById(req.params.id, function(err, data){
    if(err) {
      response = {"error": true, "message": "Error fetching data"};
    } else {
      response = {"error": false, "message": data};
    }
    res.json(response);
  });
})
.put(function(req, res){
        var response = {};
        // first find out record exists or not
        // if it does then update the record
        student.findById(req.params.id, function(err, data){
            if(err) {
                response = {"error": true, "message": "Error fetching data"};
            } else {
            // we got data from Mongo.
            // change it accordingly.
                if(req.body.userEmail !== undefined) {
                    // case where email needs to be updated.
                    data.userEmail = req.body.userEmail;
                }
                if(req.body.userPassword !== undefined) {
                    // case where password needs to be updated
                    data.userPassword = req.body.userPassword;
                }
                // save the data
                data.save(function(err){
                    if(err) {
                        response = {"error": true, "message": "Error updating data"};
                    } else {
                        response = {"error": false, "message": "Data is updated for "+req.params.id};
                    }
                    res.json(response);
                })
            }
        });
    })
.delete(function(req, res){
        var response = {};
        // find the data
        student.findById(req.params.id, function(err, data){
            if(err) {
                response = {"error": true, "message": "Error fetching data"};
            } else {
                // data exists, remove it.
                student.remove({_id : req.params.id}, function(err){
                    if(err) {
                        response = {"error": true, "message": "Error deleting data"};
                    } else {
                        response = {"error": true, "message": "Data associated with " + req.params.id + "is deleted"};
                    }
                    res.json(response);
                });
            }
        });
    })

app.use('/', router);

app.listen(3000);
console.log("Systems on line");

module.exports = Schema;
