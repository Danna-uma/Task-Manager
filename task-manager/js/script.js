const input = document.getElementById("task-input");
const select = document.getElementById("priority-select");
const dueDateInput = document.getElementById("due-date");

const addBtn = document.getElementById("add-btn");
const list = document.getElementById("task-list");

const statTotal = document.getElementById("stat-total");
const statPending = document.getElementById("stat-pending");
const statDone = document.getElementById("stat-done");

const counter = document.getElementById("pending-counter");

const themeBtn = document.getElementById("theme-btn");
const increaseBtn = document.getElementById("font-increase");
const decreaseBtn = document.getElementById("font-decrease");

const filterAll = document.getElementById("filter-all");
const filterPending = document.getElementById("filter-pending");
const filterDone = document.getElementById("filter-done");

const clearBtn = document.getElementById("clear-btn");
const emptyState = document.getElementById("empty-state");

const modalOverlay = document.getElementById("modal-overlay");
const editInput = document.getElementById("edit-input");
const editPriority = document.getElementById("edit-priority");
const editDate = document.getElementById("edit-date");

const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");

let tasks = [];
let currentFilter = "all";
let editIndex = null;

/* ==========================
   LOCAL STORAGE
========================== */

function saveTasks() {
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function loadTasks() {
    const data = localStorage.getItem("tasks");

    if (data) {
        tasks = JSON.parse(data);
    }
}

/* ==========================
   FILTROS ACTIVOS
========================== */

function updateFilters() {

    document
        .querySelectorAll(".filter")
        .forEach(btn =>
            btn.classList.remove("active")
        );

    if (currentFilter === "all") {
        filterAll.classList.add("active");
    }

    if (currentFilter === "pending") {
        filterPending.classList.add("active");
    }

    if (currentFilter === "done") {
        filterDone.classList.add("active");
    }
}

/* ==========================
   RENDER
========================== */

function render() {

    list.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(
            task => !task.done
        );
    }

    if (currentFilter === "done") {
        filteredTasks = tasks.filter(
            task => task.done
        );
    }

    filteredTasks.forEach(task => {

        const realIndex =
            tasks.indexOf(task);

        const li =
            document.createElement("li");

        li.className = "task-card";

        if (task.done) {
            li.classList.add("completed");
        }

        li.setAttribute(
            "data-priority",
            task.priority
        );

        li.innerHTML = `
            <div class="task-info">

                <span class="task-title">
                    ${task.text}
                </span>

                <div class="task-meta">

                    <span class="priority ${task.priority}">
                        ${task.priority}
                    </span>

                    <small class="due-date">
                        📅 ${task.dueDate || "Sin fecha"}
                    </small>

                </div>

            </div>

            <div class="task-actions">

                <button
                    class="icon-btn"
                    onclick="toggle(${realIndex})">
                    ✔
                </button>

                <button
                    class="icon-btn"
                    onclick="openEdit(${realIndex})">
                    ✏️
                </button>

                <button
                    class="icon-btn"
                    onclick="del(${realIndex})">
                    🗑
                </button>

            </div>
        `;

        list.appendChild(li);
    });

    const pending =
        tasks.filter(t => !t.done).length;

    const completed =
        tasks.filter(t => t.done).length;

    statTotal.textContent =
        tasks.length;

    statPending.textContent =
        pending;

    statDone.textContent =
        completed;

    counter.textContent =
        pending === 1
            ? "1 tarea pendiente"
            : `${pending} tareas pendientes`;

    emptyState.style.display =
        tasks.length === 0
            ? "block"
            : "none";

    updateFilters();

    saveTasks();
}

/* ==========================
   AGREGAR
========================== */

function add() {

    const text =
        input.value.trim();

    if (!text) return;

    tasks.push({
        text: text,
        priority: select.value,
        dueDate: dueDateInput.value,
        done: false
    });

    input.value = "";
    dueDateInput.value = "";

    render();
}

/* ==========================
   COMPLETAR
========================== */

function toggle(index) {

    tasks[index].done =
        !tasks[index].done;

    render();
}

/* ==========================
   ELIMINAR
========================== */

function del(index) {

    tasks.splice(index, 1);

    render();
}

/* ==========================
   EDITAR
========================== */

function openEdit(index) {

    editIndex = index;

    editInput.value =
        tasks[index].text;

    editPriority.value =
        tasks[index].priority;

    editDate.value =
        tasks[index].dueDate || "";

    modalOverlay.style.display =
        "flex";
}

function closeEdit() {

    modalOverlay.style.display =
        "none";

    editIndex = null;
}

function saveEdit() {

    if (editIndex === null) return;

    tasks[editIndex].text =
        editInput.value.trim();

    tasks[editIndex].priority =
        editPriority.value;

    tasks[editIndex].dueDate =
        editDate.value;

    render();

    closeEdit();
}

/* ==========================
   FILTROS
========================== */

filterAll.onclick = () => {

    currentFilter = "all";

    render();
};

filterPending.onclick = () => {

    currentFilter = "pending";

    render();
};

filterDone.onclick = () => {

    currentFilter = "done";

    render();
};

/* ==========================
   LIMPIAR COMPLETADAS
========================== */

clearBtn.onclick = () => {

    tasks = tasks.filter(
        task => !task.done
    );

    render();
};

/* ==========================
   TEMA OSCURO
========================== */

themeBtn.onclick = () => {

    document.body.classList.toggle(
        "dark"
    );

    const isDark =
        document.body.classList.contains(
            "dark"
        );

    localStorage.setItem(
        "theme",
        isDark ? "dark" : "light"
    );

    themeBtn.textContent =
        isDark ? "⚪" : "⚫";
};

/* ==========================
   ACCESIBILIDAD
========================== */

increaseBtn.onclick = () => {

    document.body.style.fontSize =
        "110%";

    localStorage.setItem(
        "fontSize",
        "110%"
    );
};

decreaseBtn.onclick = () => {

    document.body.style.fontSize =
        "95%";

    localStorage.setItem(
        "fontSize",
        "95%"
    );
};

/* ==========================
   MODAL
========================== */

saveBtn.addEventListener(
    "click",
    saveEdit
);

cancelBtn.addEventListener(
    "click",
    closeEdit
);

/* ==========================
   INICIALIZAR
========================== */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        loadTasks();

        const theme =
            localStorage.getItem(
                "theme"
            );

        if (theme === "dark") {

            document.body.classList.add(
                "dark"
            );

            themeBtn.textContent =
                "⚪";

        } else {

            themeBtn.textContent =
                "⚫";
        }

        const savedFont =
            localStorage.getItem(
                "fontSize"
            );

        if (savedFont) {

            document.body.style.fontSize =
                savedFont;
        }

        render();
    }
);

/* ==========================
   EVENTOS
========================== */

addBtn.addEventListener(
    "click",
    add
);