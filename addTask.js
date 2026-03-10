  const select = document.querySelector('.dropdown_select');
  const options = document.querySelector('.dropdown_options');
  let labels = [];
  let tasks = [];
  const addTaskButton1 = document.querySelector(".add_task_button");

  const submit = document.querySelector('.add_task');
  const input = document.querySelector('.add_todo');
  const closeButton = document.querySelector(".close_button");
  const minusButton = document.querySelector('.minus_button');

  const addLabelButton = document.querySelector(".label_button");

  async function loadTasks() {
    if (window.taskAPI) {
      tasks = await window.taskAPI.getTasks();
    } else {
      console.log("hmm these tasks are empty, maybe something is wrong...");
    }
  }
  loadTasks();
  window.taskAPI.onUpdateTask((updatedList)=>{
    tasks = updatedList;
  }) 

  addLabelButton.addEventListener('click', createNewTask);

  function createNewTask(){
      addLabelButton.style.boxShadow = `  rgba(148, 73, 87, 0.4) 0px 0px 0px 2px, 
    rgba(148, 73, 87, 0.65) 0px 4px 6px -1px, 
    rgba(148, 73, 87, 0.08) 0px 1px 0px inset`;

      setTimeout(() => {
          addLabelButton.style.boxShadow = "none";
          window.open('createLabel.html', 'AddLabelWindow', 'width=300,height=180,resizable=no,frame=no, maximizable=false,' );
      }, 150);
  }

  async function loadLabels() {
    if (window.labelAPI) {
      labels = await window.labelAPI.getLabels();
      updateLabel();
      if (labels.length > 0) {
        let selected_label = labels[0];
        select.style.setProperty('--label_hover', selected_label.hoverColor || selected_label.color);
        select.textContent = selected_label.name;
        select.style.backgroundColor = selected_label.color;
      }
    } else {
      console.log("labelAPI not available");
    }
  }

  window.labelAPI.onUpdate((updatedList) => {
    labels = updatedList;
    updateLabel();
  });

  loadLabels();

  function updateLabel(){
    options.replaceChildren();
    for(let i = 0; i < labels.length; i++){
      const option = document.createElement('div');
      option.textContent = labels[i].name;
      option.style.backgroundColor = "#ffffff";
      option.style.color = labels[i].color;
      options.appendChild(option);
      option.classList.add('option');
      option.style.setProperty('--label_color', labels[i].color)
    }
  }

  submit.addEventListener('click', ()=>{
    if(input.value.trim() !== ''){
      newTask = {
        name: input.value,
        label: select.textContent,
        color: select.style.backgroundColor,
      }

      tasks.push(newTask)

      window.taskAPI.updateTasks(tasks);

      window.close();

    }

  })

  closeButton.addEventListener('click', ()=>{
    closeButton.style.boxShadow = `
    rgba(148, 73, 87, 0.4) 0px 0px 0px 2px, 
    rgba(148, 73, 87, 0.65) 0px 4px 6px -1px, 
    rgba(148, 73, 87, 0.08) 0px 1px 0px inset
    `;
    closeButton.style.transform = "translateY(2px)";
      setTimeout(() => {
        window.close();
      }, 50);
  });

  minusButton.addEventListener('click', ()=>{
      minusButton.style.boxShadow = `
    rgba(148, 73, 87, 0.4) 0px 0px 0px 2px, 
    rgba(148, 73, 87, 0.65) 0px 4px 6px -1px, 
    rgba(148, 73, 87, 0.08) 0px 1px 0px inset
    `;
    closeButton.style.transform = "translateY(2px)";

    setTimeout(() => {
      minusButton.style.boxShadow = "none";
      minusButton.style.transform = "";
      window.electronAPI.minimizeWindow();
    }, 150);
  });

  document.addEventListener('click', (e)=>{
    if(e.target.closest('.dropdown_select')) {
      options.classList.toggle('show');

      if (options.classList.contains('show')) {
        select.style.borderBottomLeftRadius = "0";
        select.style.borderBottomRightRadius = "0";
      } else {
        select.style.borderBottomLeftRadius = "30px";
        select.style.borderBottomRightRadius = "30px";
      }
    }
    else {
      options.classList.remove('show')
      select.style.borderBottomLeftRadius = "30px";
      select.style.borderBottomRightRadius = "30px";
    }; 

    if(e.target.closest('.dropdown_options div')){
      let selected_label = labels.find(label => label.name === e.target.textContent);
      
      select.style.setProperty('--label_hover', selected_label.hoverColor || selected_label.color);
      select.textContent = selected_label.name;
      select.style.backgroundColor = selected_label.color;
      
      options.classList.remove('show');
      select.style.borderBottomLeftRadius = "30px";
      select.style.borderBottomRightRadius = "30px";
    }
  })