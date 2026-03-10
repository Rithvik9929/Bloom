const addTaskButton = document.querySelector(".add_task_button");
const taskList = document.querySelector(".task_list")
let tasks = [];
let lastKnownTasks = [];
const closeButton = document.querySelector(".close_button");
const minusButton = document.querySelector(".minus_button");


closeButton.addEventListener('click', ()=>{
  closeButton.style.boxShadow = `
  rgba(148, 73, 87, 0.4) 0px 0px 0px 2px, 
  rgba(148, 73, 87, 0.65) 0px 4px 6px -1px, 
  rgba(148, 73, 87, 0.08) 0px 1px 0px inset
  `;
  closeButton.style.transform = "translateY(2px)";
    setTimeout(() => {
      closeButton.style.transform = "";
      window.close();
    }, 50);
});

minusButton.addEventListener('click', ()=>{
    minusButton.style.boxShadow = `
  rgba(148, 73, 87, 0.4) 0px 0px 0px 2px, 
  rgba(148, 73, 87, 0.65) 0px 4px 6px -1px, 
  rgba(148, 73, 87, 0.08) 0px 1px 0px inset
  `;
  minusButton.style.transform = "translateY(2px)";
   setTimeout(() => {
    minusButton.style.boxShadow = "none";
    minusButton.style.transform = "";
    window.electronAPI.minimizeWindow();
  }, 150);
});

const submit1 = document.querySelector('.add_task');



async function loadTasks() {
  if (window.taskAPI) {
    tasks = await window.taskAPI.getTasks();
  } else {
    console.log("hmm these tasks are empty, maybe something is wrong...");
  }
}
async function init() {
  await loadTasks();
  lastKnownTasks = [...tasks];
  refreshTask(tasks);
}

init(); 
window.taskAPI.onUpdateTask((updatedList) => {

  tasks = updatedList;
  const oldLength = lastKnownTasks.length;
  const newLength = tasks.length;
  if(newLength>oldLength){
    refreshTask(tasks, "ADD");
  }
  else if (newLength < oldLength) {
    refreshTask(tasks);
  }
   lastKnownTasks = [...tasks];
});
function refreshTask(list, type = "") {
  taskList.innerHTML = "";
  
  list.forEach((task, index) => {
    const taskItem = document.createElement("div");
    taskItem.className = "task_item";
    taskItem.style.backgroundColor = task.color;

    const taskText = document.createElement("span");
    taskText.className = "task_text";
    taskText.textContent = task.name;
    taskItem.appendChild(taskText);

    if (type === "ADD" && index === list.length - 1) {
      taskItem.classList.add("task-enter");
      taskItem.addEventListener("animationend", () => {
        taskItem.classList.remove("task-enter");
      }, { once: true });
    }

    taskItem.addEventListener('dblclick', () => {

      taskText.classList.add("strike");

      setTimeout(() => {
        taskItem.classList.add("task-exit");

        taskItem.addEventListener("transitionend", () => {

        tasks = tasks.filter((t) => t.name !== task.name);
          window.taskAPI.updateTasks(tasks);

        }, { once: true });

    }, 500); // 400ms strike + 100ms pause
});

    taskList.appendChild(taskItem);
  });
}

function handleDeleteSequence(newList) {
  const deletedIndex = lastKnownTasks.findIndex((task, i) => newList[i]?.name !== task.name);

  const target = taskList.children[deletedIndex];
  if (target) {
    target.classList.add('task-exit');

    target.onanimationend = () => {
      lastKnownTasks = [...tasks]; 
      refreshTask(lastKnownTasks);
      window.taskAPI.updateTasks(tasks);   
    };
  } else {
    lastKnownTasks = [...tasks];
    refreshTask(lastKnownTasks);
  }
}

addTaskButton.addEventListener('click', createNewTask);

function createNewTask(){

    addTaskButton.style.boxShadow = `  rgba(148, 73, 87, 0.4) 0px 0px 0px 2px, 
  rgba(148, 73, 87, 0.65) 0px 4px 6px -1px, 
  rgba(148, 73, 87, 0.08) 0px 1px 0px inset`;

    setTimeout(() => {
        addTaskButton.style.boxShadow = "none";


        window.open('createTask.html', 'AddTaskWindow', 'width=350,height=500,resizable=no,frame=no');
    }, 150);

}



