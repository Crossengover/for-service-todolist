document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const taskInput = document.getElementById("taskInput");
  const tasksList = document.getElementById("tasksList");
  const emptyList = document.getElementById("emptyList");

  // Загрузка задач из localStorage
  loadTasks();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskText = taskInput.value.trim();
    if (taskText) {
      addTask(taskText);
      taskInput.value = "";
      saveTasks();
    }
  });

  function addTask(taskText) {
    const taskItem = document.createElement("li");
    taskItem.className =
      "list-group-item d-flex justify-content-between task-item";

    taskItem.innerHTML = `
              <span class="task-title">${taskText}</span>
              <div class="task-item__buttons">
                  <button type="button" data-action="done" class="btn-action">
                      <img src="./img/tick.svg" alt="Done" width="18" height="18">
                  </button>
                  <button type="button" data-action="delete" class="btn-action">
                      <img src="./img/cross.svg" alt="Delete" width="18" height="18">
                  </button>
              </div>
          `;

    taskItem
      .querySelector('[data-action="done"]')
      .addEventListener("click", () => {
        taskItem.classList.toggle("task-item--done");
        const isDone = taskItem.classList.contains("task-item--done");

        // Меняем стиль кнопки в зависимости от состояния задачи
        const doneButton = taskItem.querySelector('[data-action="done"]');
        doneButton.style.opacity = isDone ? 0.5 : 1; // Тусклость кнопки

        saveTasks();
      });

    taskItem
      .querySelector('[data-action="delete"]')
      .addEventListener("click", () => {
        tasksList.removeChild(taskItem);
        saveTasks();
        checkEmptyList();
      });

    tasksList.insertBefore(taskItem, emptyList);
    checkEmptyList();
  }

  function checkEmptyList() {
    if (tasksList.children.length > 1) {
      emptyList.classList.add("d-none");
    } else {
      emptyList.classList.remove("d-none");
    }
  }

  function saveTasks() {
    const tasks = [];
    const taskItems = tasksList.querySelectorAll(".task-item");
    taskItems.forEach((item) => {
      const taskTitle = item.querySelector(".task-title").textContent;
      const isDone = item.classList.contains("task-item--done");
      tasks.push({ title: taskTitle, done: isDone });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
      addTask(task.title);
      if (task.done) {
        const taskItem = tasksList.lastChild; // последний добавленный элемент
        taskItem.classList.add("task-item--done");
        // Меняем стиль кнопки при загрузке
        const doneButton = taskItem.querySelector('[data-action="done"]');
        doneButton.style.opacity = 0.5; // Тусклость кнопки
      }
    });
  }
});
