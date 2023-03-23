const secondHand = document.querySelector('.second-hand');
const minsHand = document.querySelector('.min-hand');
const hourHand = document.querySelector('.hour-hand');
const taskList = document.querySelector('.tasklist');
const addBtn = document.getElementById('add');
const editBtn = document.getElementById('editBtn');
const deleteBtn = document.getElementById('deleteBtn');
const taskInput = document.getElementById('taskInput');
const timeInput = document.getElementById('timeInput');
const alertAudio = new Audio('assets/alert.mp3.mp3');
const urlParams = new URLSearchParams(location.search);
var taskArr = [];
var portNumber;

if(urlParams.get('db')==0){
    portNumber = 8080;
    console.log(portNumber);
}else if(urlParams.get('db')==1){
    portNumber = 9090;
    console.log(portNumber);
}else{
    console.log('No database selected. Please use query params to choose db.');
}

function setDate() {
    const now = new Date();
    const seconds = now.getSeconds();
    const secondsDegrees = ((seconds / 60) * 360) + 90;
    secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

    const mins = now.getMinutes();
    const minsDegrees = ((mins / 60) * 360) + ((seconds / 60) * 6) + 90;
    minsHand.style.transform = `rotate(${minsDegrees}deg)`;

    const hour = now.getHours();
    const hourDegrees = ((hour / 12) * 360) + ((mins / 60) * 30) + 90;
    hourHand.style.transform = `rotate(${hourDegrees}deg)`;

    if (taskArr.length > 0) checkAlarm(taskArr, hour, mins, seconds);
}

setInterval(setDate, 1000)

setDate();




addTask = () => {
    if (taskInput.value != "" && timeInput.value != "") {

        const data = {
            task: taskInput.value,
            time: timeInput.value,
        };

        fetch(`http://localhost:${portNumber}/api/todos/`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((sts) => {
                console.log("Başarılı.");
                readFromDatabase();
            })
            .catch((error) => {
                console.error("Error:", error);
            });

        taskInput.value = '';
        timeInput.value = '';


    } else {
        if (taskInput.value == "")
            alert('Lütfen görev bilgisini boş bırakmayınız!');
        else alert('Lütfen görev zamanını seçiniz!');
    }
}

editTask = (selectedTask) => {

    let selected = selectedTask.parentElement.firstChild;
    let id = selectedTask.parentElement.id;
    let timeEdit = selectedTask.previousSibling;


    if (selected.readOnly == true) {
        selected.readOnly = false;
        timeEdit.readOnly = false;

        selectedTask.innerText = '✔️';


        selected.classList.remove('task');
        selected.classList.add('editmode');
        timeEdit.classList.remove('task-time');
        timeEdit.classList.add('time-edit-mode');
    } else {
        selected.readOnly = true;
        timeEdit.readOnly = true;

        selected.classList.remove('editmode');
        selected.classList.add('task');
        timeEdit.classList.remove('time-edit-mode');
        timeEdit.classList.add('task-time');

        const data = {
            task: selected.value,
            time: timeEdit.value,
        };

        fetch(`http://localhost:${portNumber}/api/todos/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((sts) => {
                console.log("Başarılı.");
                readFromDatabase();
            })
            .catch((error) => {
                console.error("Error:", error);
            });

        

        selectedTask.innerText = '✏️';
    }


}

createTask = (id, taskDesc, taskHour) => {
    let liElm, inputElm, timeElm, edit, dlt;

    liElm = document.createElement('li');

    inputElm = document.createElement('input');
    inputElm.value = taskDesc;

    timeElm = document.createElement('input');
    timeElm.setAttribute('type', 'time');
    timeElm.setAttribute('readonly', 'readonly');
    timeElm.classList.add('task-time');
    timeElm.value = taskHour;


    inputElm.setAttribute('readonly', 'readonly')
    inputElm.classList.add('task');


    edit = document.createElement('button');
    edit.innerText = '✏️';
    edit.setAttribute('id', 'editBtn')
    edit.setAttribute('onclick', 'editTask(this)');


    dlt = document.createElement('button');
    dlt.innerText = '🗑️';
    dlt.setAttribute('id', 'deleteBtn');
    dlt.setAttribute('onclick', 'deleteTask(this)');

    liElm.appendChild(inputElm);
    liElm.appendChild(timeElm);
    liElm.appendChild(edit);
    liElm.appendChild(dlt);
    liElm.setAttribute('id', id);

    return liElm;
}


deleteTask = (selectedTask) => {
    let selected = selectedTask.parentElement;
    let id = selected.id;
    taskList.removeChild(selected);

    fetch(`http://localhost:${portNumber}/api/todos/${id}`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then((response) => response.json())
        .then((sts) => {
            console.log("Başarılı.");
            readFromDatabase();
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    
}

checkAlarm = (tasks, hour, mins, secs) => {
    hour = fixTime(hour);
    mins = fixTime(mins);
    secs = fixTime(secs);

    tasks.forEach(item => {
        let alertTime = item.firstChild.nextSibling.value + ':' + '00';
        let currTime = hour + ':' + mins + ':' + secs;
        if (alertTime == currTime) {
            alertAudio.play();
            alert(item.firstChild.value + ' görevi için alarm!');
            item.firstChild.style.textDecoration = 'line-through';
        }
    })
}

fixTime = (x) => {
    if (x < 10) {
        x = '0' + x;
    }
    return x;
}

sortTasks = () => {
    taskArr.sort((a, b) => {
        const firstTaskTime = a.firstChild.nextSibling.value;
        const secondTaskTime = b.firstChild.nextSibling.value;
        const firstTaskHour = Number(firstTaskTime.slice(0, 2));
        const firstTaskMinute = Number(firstTaskTime.slice(3));
        const secondTaskHour = Number(secondTaskTime.slice(0, 2));
        const secondTaskMinute = Number(secondTaskTime.slice(3));


        if (firstTaskHour - secondTaskHour == 0) {
            return firstTaskMinute - secondTaskMinute;
        } else return firstTaskHour - secondTaskHour;
    });

    taskList.innerHTML = "";
    taskArr.forEach(item => {
        taskList.appendChild(item);
    });
}

// Read tasks from database

readFromDatabase = () => {
    fetch(`http://localhost:${portNumber}/api/todos/`)
        .then((response) => response.json())
        .then((sts) => {
            taskArr = [];
            if(portNumber==8080){
                sts.todos.forEach((item) => {
                    const task = createTask(item._id, item.task, item.time)
                    taskArr.push(task);
                })
            }else if(portNumber==9090){
                sts.forEach((item) => {
                    const task = createTask(item.id, item.task, item.time)
                    taskArr.push(task);
                })
            }
            sortTasks();
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

readFromDatabase();