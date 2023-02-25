const secondHand = document.querySelector('.second-hand');
const minsHand = document.querySelector('.min-hand');
const hourHand = document.querySelector('.hour-hand');
const taskList = document.querySelector('.tasklist');
const addBtn = document.getElementById('add');
const editBtn = document.getElementById('editBtn');
const deleteBtn = document.getElementById('deleteBtn');
const taskInput = document.getElementById('taskInput');
const timeInput = document.getElementById('timeInput');
const updateBtn = document.getElementById('update');
const cancelBtn = document.getElementById('cancel');

var task = { taskID: '', taskDescription: '', taskTime: '' };
var taskArr = [];


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
}

setInterval(setDate, 1000)

setDate();

addTask = () => {

    let newTask = createTask(taskInput.value, timeInput.value)
    taskList.appendChild(newTask);

    taskInput.value = '';
    timeInput.value = '';
}

editTask = (selectedTask) => {

    let selected = selectedTask.parentElement.firstChild;

    if(selected.readOnly == true){
        selected.readOnly = false;
        selectedTask.innerText = '✔️';
        selected.classList.remove('task');
        selected.classList.add('editmode');
    }else{
        selected.readOnly = true;
        selected.classList.remove('editmode');
        selected.classList.add('task');
        selectedTask.innerText = '✏️';
    }
    
}

createTask = (taskDesc, taskHour) => {
    let liElm,inputElm, sElm, edit, dlt;

    liElm = document.createElement('li');

    inputElm = document.createElement('input');
    inputElm.value = taskDesc;

    sElm = document.createElement('span');
    sElm.innerHTML = taskHour;

    inputElm.setAttribute('readonly','readonly')
    inputElm.classList.add('task');
    sElm.classList.add('task-time');


    edit = document.createElement('button');
    edit.innerText = '✏️';
    edit.classList.add('hide');
    edit.setAttribute('id', 'editBtn')
    edit.setAttribute('onclick', 'editTask(this)');


    dlt = document.createElement('button');
    dlt.innerText = '🗑️';
    dlt.classList.add('hide');
    dlt.setAttribute('id', 'deleteBtn');
    dlt.setAttribute('onclick', 'deleteTask()');

    liElm.appendChild(inputElm);
    liElm.appendChild(sElm);
    liElm.appendChild(edit);
    liElm.appendChild(dlt);

    return liElm;
}