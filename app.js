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
    if (taskInput.value != "" && timeInput.value != "") {
        let newTask = createTask(taskInput.value, timeInput.value)
        taskList.appendChild(newTask);

        taskInput.value = '';
        timeInput.value = '';
    } else {
        alert('Lütfen bilgileri boş bırakmayınız!');
    }

}

editTask = (selectedTask) => {

    let selected = selectedTask.parentElement.firstChild;
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

        selectedTask.innerText = '✏️';
    }

}

createTask = (taskDesc, taskHour) => {
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
    edit.classList.add('hide');
    edit.setAttribute('id', 'editBtn')
    edit.setAttribute('onclick', 'editTask(this)');


    dlt = document.createElement('button');
    dlt.innerText = '🗑️';
    dlt.classList.add('hide');
    dlt.setAttribute('id', 'deleteBtn');
    dlt.setAttribute('onclick', 'deleteTask(this)');

    liElm.appendChild(inputElm);
    liElm.appendChild(timeElm);
    liElm.appendChild(edit);
    liElm.appendChild(dlt);

    return liElm;
}


deleteTask = (selectedTask) => {
    let selected = selectedTask.parentElement;
    taskList.removeChild(selected);
}