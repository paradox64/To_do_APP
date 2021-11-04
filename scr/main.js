
/*
funciones fetch para traer y actualizar
las tareas.
*/

const url ="http://localhost:8080/api";

function insertNewTask(inputValue){ 
    const task={
        Tname:inputValue,
        done:'false'
    }
    
      fetch(url, {
        method: "POST",
        body: JSON.stringify(task),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
}

function deleteTask(inputValue){ 
    const task={
        Tname:inputValue,
    }
      fetch(url+"/delete", {
        method: "POST",
        body: JSON.stringify(task),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
}


function updateTaskName(name,new_name){ 
    const task={
        Tname:name,
        newname:new_name
    }
      fetch(url+"/updateName", {
        method: "POST",
        body: JSON.stringify(task),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
}

function updateTaskDone(name,value){ 
    const task={
        Tname:name,
        done:value
    }
      fetch(url+"/updateTaskDone", {
        method: "POST",
        body: JSON.stringify(task),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
}


function getAllTask(){
    fetch(url)
    .then(res=>res.json())
    .then(data=>{
        let i=0
        let done;
        while(data.length>i){
        if (data[i].done=='true'){
            done=true
        }else{
            done=false
        }
        agregar(data[i].nameT,done)
        i++;
        }
    })
    .catch(err=>console.log(err))
 
}

getAllTask() //obtiene todas las tareas guardadas en la BDD


/*------------------------------
Objeto carpeta que almacena en memoria
las tareas de la base de datos
-------------------------------*/

const folderItems = {
    name,
    list:[],
    agregarItem: function(item){
        this.list.push(item)
    },buscarItem: function int(name){
        var i=0;
        var pos=-1
        while(i<this.list.length){
            if (this.list[i].name==name){
                pos =i;
            }
            i++;
        } 
        return pos;
    },
    existeItem:function boolean(name){
        var i=0;
        var b=true;
        if (this.buscarItem(name)==-1){
                b =false
        } 
        return b;
    },
    marcarCheckbox: function(name){
        var i =this.buscarItem(name);
        if (i!=-1){
        if (this.list[i].done){
            this.list[i].done=false
            return 'false'
        } else {
            this.list[i].done=true
            return 'true'
    }}
    },removeItem: function(name){
        var i =this.buscarItem(name);
        if (i!=-1){
        this.list.splice(i,1);
    }
    },changeName: function(name,newname){
        var i= this.buscarItem(name);
        if (this.buscarItem(newname)==-1){
        if (i!=-1){
            this.list[i].name=newname;
            return true;//return true if name change
        }}
        console.log('no cambio')
        return false;
    }
}

/*------------------------------
Funcion agregar, crea todos los 
elementos html de un tarea
-------------------------------*/
function  agregar(inputValue,doneFlag){
    control=-1;
    if (inputValue!=="" ){
        let item={
        name:inputValue,
        done:doneFlag
        }
        if (false==folderItems.existeItem(inputValue)){
            folderItems.agregarItem(item)
            let checkbox =document.createElement("input");
            let botonRemove=document.createElement("button");
            let botonEdit=document.createElement("button");
            let label =document.createElement("input");
            botonEdit.id=inputValue+"_btnEdit";
            botonEdit.innerHTML="edit";
            botonEdit.className="btnEdit btn-outline-primary";
            botonEdit.addEventListener('click', function() {
                let change = document.getElementById(inputValue+"_label");
                c=change.value.toString()
                c=c.toLowerCase()
                if (folderItems.changeName(inputValue,c)){
                    updateTaskName(inputValue,c);
                    change.id=inputValue+"_label";
                } else {
                    change.value=inputValue;
                }
            })
            botonRemove.id=inputValue+"_btnRemove";
            botonRemove.innerHTML="Delete";
            botonRemove.className="btnRemove btn-outline-primary";
            botonRemove.addEventListener('click', function() {
                let rmvBtn = document.getElementById(inputValue);
                rmvBtn.remove();
                rmvBtn = document.getElementById(inputValue+"_btnRemove");
                rmvBtn.remove();
                rmvBtn = document.getElementById(inputValue+"_label");
                rmvBtn.remove();
                rmvBtn = document.getElementById(inputValue+"_btnEdit");
                rmvBtn.remove();
                rmvBtn = document.getElementById(inputValue+"_separador");
                rmvBtn.remove();
                folderItems.removeItem(inputValue);
                deleteTask(inputValue)
            })
            checkbox.id=inputValue;
            checkbox.type="checkbox";
            checkbox.className="checkmark";
            checkbox.name=inputValue;
            checkbox.value="inputValue";
            if (doneFlag){
                checkbox.checked=true;
            }else{
                checkbox.checked=false;
            }
            checkbox.addEventListener('change', function() {
                let valuechange=folderItems.marcarCheckbox(inputValue);
                updateTaskDone(inputValue,valuechange);      
            })
            label.innerHTML=inputValue;
            label.value=inputValue;
            label.className="form-control";
            label.id=inputValue+"_label";    
            let lista = document.getElementById("list");
            let container=document.createElement("separador");
            container.id=inputValue+"_separador"
            container.className="container";
            lista.append(container);
            container.append(checkbox);
            container.append(label);   
            container.append(botonRemove);
            container.append(botonEdit);
            control=0;
        }
    }
  return control;
    
}

const btnAgregar = document.getElementById("btnAdd");
btnAgregar.addEventListener('click',(e) =>{
    let inputValue=document.getElementById("input").value;
    inputValue.toString()
    inputValue=inputValue.toLowerCase()
    var control=agregar(inputValue,false);
    if (control==0){
        insertNewTask(inputValue);
    } else{
        alert('la tarea ('+inputValue+') ya existe');
    }
})

