const select = document.querySelector('.dropdown_select');
const options = document.querySelector('.dropdown_options');
const closeButton = document.querySelector(".clos_button");
const minusButton = document.querySelector(".minu_button");
const replace = document.querySelector('.replaces_Text');
const input = document.querySelector('.add_label');
const submitt = document.querySelector('.create_button');

let label_options = [
  { color: "#944957" },
  { color: "#9B7EBD" },
  { color: "#6A8DB5" },
  { color: "#5F9EE6"},
  { color: "#387339" },
  { color: "#73BF74"},
  { color: "#FFEE8C"},
  { color: "#FAC898"},
  { color: "#f19641"},
  { color: "#ff5858"}

];
let labels = [];
async function loadLabels() {
  if (window.labelAPI) {
    labels = await window.labelAPI.getLabels();
  } else {
    console.log("hmm these labels are empty, maybe something is wrong...");
  }
}


function submit() {
  if(input.value.trim() !== ''){
      const newLabel = {
        name: input.value,
        color: normaliseColor(select.style.backgroundColor),
      }
      let replacess = false;
      let pos = 0;
      for(let i = 0; i<labels.length;i++){
        if(normaliseColor(labels[i].color) === newLabel.color){
          replacess = true;
          pos = i;
          break;
        }
      }
      if(replacess){
        labels[pos] = newLabel;
      }
      else{
        labels.push(newLabel);
      }
      saveLabels(labels);
      window.close();
  }
}
window.labelAPI.onUpdate((updatedList) => {
  labels = updatedList;
});
function saveLabels(newList) {
  window.labelAPI.updateLabels(newList);
}

loadLabels();
let selected_label_option = label_options[0];
select.style.backgroundColor = selected_label_option.color;

document.addEventListener('click', async (e) => {
  if (e.target.closest('.dropdown_select')) {
    options.classList.toggle('show');

    if (options.classList.contains('show')) {
      select.style.borderBottomLeftRadius = "0px";
      select.style.borderBottomRightRadius = "0px";
    } else {
      select.style.borderBottomLeftRadius = "50%";
      select.style.borderBottomRightRadius = "50%";
    }
  } 
  else {
    options.classList.remove('show');
    select.style.borderBottomLeftRadius = "50%";
    select.style.borderBottomRightRadius = "50%";
  }

  if (e.target.closest('.option')) {
    const clickedColor = e.target.style.backgroundColor;
    select.style.backgroundColor = clickedColor;
    await loadLabels();
    checkReplace();
    
    options.classList.remove('show');
    select.style.borderBottomLeftRadius = "50%";
    select.style.borderBottomRightRadius = "50%";
  }
});

submitt.addEventListener('click', ()=>{
  submit();
});

function normaliseColor(color){
  const temp = document.createElement('span');
  temp.style.color = color;

  return temp.style.color;
}

function checkReplace(){

  const currentColor = normaliseColor(select.style.backgroundColor);
  
  for(let i =0;i<labels.length;i++){
    if(currentColor === normaliseColor(labels[i].color)){
      replace.classList.add('show');
      replace.textContent = 'Replaces: ' + labels[i].name;
      return;
    }

  }
  replace.classList.remove('show');
  
}

function updateLabelOption() {
  options.replaceChildren();
  for (let i = 0; i < label_options.length; i++) {
    const option = document.createElement('div');
    option.classList.add('option');
    option.style.backgroundColor = label_options[i].color;
    options.appendChild(option);
  }
}

updateLabelOption();

closeButton.addEventListener('click', () => {
  window.close();
});

minusButton.addEventListener('click', () => {
  if(window.electronAPI) window.electronAPI.minimizeWindow();
});




