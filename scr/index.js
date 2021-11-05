const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;
const bp = require('body-parser')
app.use("/", express.static(__dirname + '/'));
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

// ---------------
// SQL CONNECTION
const mysql = require("mysql");
const { type } = require('os');

var con=mysql.createConnection({
  user: 'root', 
  host:'localhost',
  password:'',
  database:'to_doapp_db'
})

con.connect((err)=>{
  if (!err){
    console.log("conexion establecida")
  }else{ 
    console.log(err)
  }
})

// Create table task if doesnt exist
con.query("SELECT * FROM task ", 
function(err,datos){
    if (err){
        if (err.code =='ER_NO_SUCH_TABLE'){
          con.query("create table task (nameT varChar(250), done varChar(5),constraint pk_task primary key(nameT));",
            function(err,datos){
            if (err) {
              console.log(err);
            }else {
              console.log(datos);
              console.log('tabla creada');
            }
         })
    }}
})

//--------
//ROUTES

//Send the html document to client
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/html.html')); 
}); 

//Get all the rows from table task
app.get('/api',(req,res)=>{
  con.query("SELECT * FROM task",function(err,datos){
    if (err){
        return res.send(err);
     }else{
         res.json(datos);
     }
  })}
)

//Insert a new row in table task, in other words a new to-do item is added 
app.post('/api',(req,res)=>{
  var sql = "INSERT INTO task (nameT, done) VALUES ('"+req.body.Tname+"','false')";
  console.log(sql)
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("row inserted");
  });
  }
)

//Delete a task from the table task
app.post('/api/delete',(req,res)=>{
  var sql = "DELETE FROM task  WHERE TASK.nameT='"+req.body.Tname+"'";
  console.log(sql)
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("row delete");
  });
  }
)


//Change the primary key of an element from the task table
app.post('/api/updateName',(req,res)=>{
  var sql = "UPDATE task SET nameT= '"+req.body.newname+"' WHERE TASK.nameT='"+req.body.Tname+"'";
  console.log(sql)
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("row change");
  });
  }
)

//Update the value of 'done' from the task table
app.post('/api/updateTaskDone',(req,res)=>{
  
  var sql = "UPDATE task SET done= '"+req.body.done+"' WHERE TASK.nameT='"+req.body.Tname+"'";
  console.log(sql)
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("row change");
  });
  }
)


//----- 
app.listen(port); 
console.log('Server started at http://localhost:' + port);

