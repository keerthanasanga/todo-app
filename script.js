let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let completed = JSON.parse(localStorage.getItem("completed")) || [];

function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("completed", JSON.stringify(completed));
}

function render() {
    let taskList = document.getElementById("taskList");
    let completedList = document.getElementById("completedList");

    taskList.innerHTML = "";
    completedList.innerHTML = "";

    document.getElementById("count").innerText = completed.length;
    document.getElementById("taskCount").innerText = tasks.length;

    /* TASKS */
    tasks.forEach((task, i) => {
        let div = document.createElement("div");
        div.className = "task";

        div.innerHTML = `
            <input type="checkbox" onchange="completeTask(${i})">

            <span ondblclick="enableEdit(this, ${i})">${task}</span>

            <div class="actions">
                <button class="edit" onclick="enableEdit(this.parentElement.previousElementSibling, ${i})">✏️</button>
                <button class="delete" onclick="deleteTask(${i})">✖</button>
            </div>
        `;

        taskList.appendChild(div);
    });

    /* COMPLETED */
    completed.forEach((task, i) => {
        let div = document.createElement("div");
        div.className = "task";

        div.innerHTML = `
            <input type="checkbox" checked onchange="undoTask(${i})">

            <span class="done">${task}</span>

            <div class="actions">
                <button class="delete" onclick="deleteCompleted(${i})">✖</button>
            </div>
        `;

        completedList.appendChild(div);
    });

    save();
}

/* ADD */
function addTask() {
    let input = document.getElementById("taskInput");
    if (!input.value.trim()) return;

    tasks.push(input.value);
    input.value = "";
    render();
}

/* COMPLETE */
function completeTask(i) {
    completed.push(tasks[i]);
    tasks.splice(i, 1);
    render();
}

/* UNDO */
function undoTask(i) {
    tasks.push(completed[i]);
    completed.splice(i, 1);
    render();
}

/* DELETE */
function deleteTask(i) {
    tasks.splice(i, 1);
    render();
}

function deleteCompleted(i) {
    completed.splice(i, 1);
    render();
}

/* EDIT FEATURE */
function enableEdit(span, index) {
    let currentText = span.innerText;

    let input = document.createElement("input");
    input.type = "text";
    input.value = currentText;
    input.className = "edit-input";

    span.replaceWith(input);
    input.focus();

    input.onblur = () => saveEdit(input, index);
    input.onkeypress = (e) => {
        if (e.key === "Enter") saveEdit(input, index);
    };
}

function saveEdit(input, index) {
    let newText = input.value.trim();
    if (!newText) newText = "Untitled Task";

    tasks[index] = newText;
    render();
}

/* SEARCH */
document.getElementById("search").addEventListener("keyup", function () {
    let value = this.value.toLowerCase();
    document.querySelectorAll(".task").forEach(task => {
        task.style.display = task.innerText.toLowerCase().includes(value)
            ? "flex" : "none";
    });
});

/* TABS */
function showTab(tab) {
    document.getElementById("tasksTab").classList.add("hidden");
    document.getElementById("completedTab").classList.add("hidden");

    document.querySelectorAll(".tabs button").forEach(btn => btn.classList.remove("active"));

    if (tab === "tasks") {
        document.getElementById("tasksTab").classList.remove("hidden");
        document.querySelectorAll(".tabs button")[0].classList.add("active");
    } else {
        document.getElementById("completedTab").classList.remove("hidden");
        document.querySelectorAll(".tabs button")[1].classList.add("active");
    }
}

render();