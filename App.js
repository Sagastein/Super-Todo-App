document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const editTaskModal = document.getElementById("editTaskModal");
  const editTaskText = document.getElementById("editTaskText");
  const editTaskDescription = document.getElementById("editTaskDescription");
  const saveEditBtn = document.getElementById("saveEditBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  let editingTask = null;

  function saveTasksToLocalStorage() {
    const tasks = Array.from(taskList.children).map((taskItem) => ({
      text: taskItem.querySelector(".task-text").textContent,
      description: taskItem.querySelector(".task-description").textContent,
      completed: taskItem.classList.contains("completed"),
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
      const taskItem = createTaskElement(
        task.text,
        task.description,
        task.completed
      );
      taskList.appendChild(taskItem);
    });
  }

  function createTaskElement(taskText, taskDescription, completed = false) {
    const taskItem = document.createElement("li");
    taskItem.className =
      "mb-2 task-item bg-white rounded-lg overflow-hidden shadow-md";

    const taskContainer = document.createElement("div");
    taskContainer.className = "flex p-3 justify-between items-center";

    const taskInfoContainer = document.createElement("div");
    taskInfoContainer.className = "flex flex-col";

    const taskTitleElement = document.createElement("span");
    taskTitleElement.textContent = taskText;
    taskTitleElement.className = completed
      ? "completed task-text mb-1"
      : "task-text mb-1";
    taskInfoContainer.appendChild(taskTitleElement);

    const taskDescriptionElement = document.createElement("p");
    taskDescriptionElement.textContent = taskDescription;
    taskDescriptionElement.className = "task-description text-sm text-gray-600";
    taskInfoContainer.appendChild(taskDescriptionElement);

    const editDeleteContainer = document.createElement("div");
    editDeleteContainer.className = "flex gap-2";

    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.className = "text-blue-500 edit-btn";
    editButton.addEventListener("click", function () {
      editingTask = taskItem;
      editTaskText.value = taskText;
      editTaskDescription.value = taskDescription;
      editTaskModal.classList.remove("hidden");
    });
    editDeleteContainer.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.className = "text-red-500";
    deleteButton.addEventListener("click", function () {
      taskItem.remove();
      saveTasksToLocalStorage();
    });
    editDeleteContainer.appendChild(deleteButton);

    taskContainer.appendChild(taskInfoContainer);
    taskContainer.appendChild(editDeleteContainer);

    taskItem.appendChild(taskContainer);

    return taskItem;
  }

  addTaskBtn.addEventListener("click", function () {
    const taskText = taskInput.value.trim();
    const taskDescription = "";
    if (taskText !== "") {
      const taskItem = createTaskElement(taskText, taskDescription);
      taskList.appendChild(taskItem);
      taskInput.value = "";
      saveTasksToLocalStorage();
    }
  });

  taskList.addEventListener("dblclick", function (event) {
    const taskItem = event.target.closest(".task-item");
    const isEditButton = event.target.classList.contains("edit-btn");

    if (taskItem && !isEditButton) {
      taskItem.classList.toggle("completed");
      saveTasksToLocalStorage();
    }
  });

  saveEditBtn.addEventListener("click", function () {
    if (editingTask) {
      editingTask.querySelector(".task-text").textContent = editTaskText.value;
      editingTask.querySelector(".task-description").textContent =
        editTaskDescription.value;
      saveTasksToLocalStorage();
      editingTask = null;
      editTaskModal.classList.add("hidden");
    }
  });

  cancelEditBtn.addEventListener("click", function () {
    editingTask = null;
    editTaskModal.classList.add("hidden");
  });

  loadTasksFromLocalStorage();
});
