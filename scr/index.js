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


//--------
//ROUTES
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/html.html')); 
}); 

app.get('/api',(req,res)=>{
  con.query("SELECT * FROM task",function(err,datos){
    if (err){
        return res.send(err);
     }else{
         res.json(datos);
     }
  })}
)

app.post('/api',(req,res)=>{
  var sql = "INSERT INTO task (nameT, done) VALUES ('"+req.body.Tname+"','false')";
  console.log(sql)
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("row inserted");
  });
  }
)

app.post('/api/delete',(req,res)=>{
  var sql = "DELETE FROM task  WHERE TASK.nameT='"+req.body.Tname+"'";
  console.log(sql)
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("row delete");
  });
  }
)

app.post('/api/updateName',(req,res)=>{
  
  var sql = "UPDATE task SET nameT= '"+req.body.newname+"' WHERE TASK.nameT='"+req.body.Tname+"'";
  console.log(sql)
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("row change");
  });
  }
)

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

