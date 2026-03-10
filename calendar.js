const calendarEl = document.querySelector(".calendar")

let calendar


document.querySelector(".load").onclick = async () => {

  const url = document.querySelector(".calendar_url").value
  await window.calendarAPI.setCalendarURL(url)

  refreshCalendar()
}

const titleBar = document.querySelector('.main_bloom');

titleBar.addEventListener('dblclick', () => {
    window.electronAPI.maximizeWindow(); 
});


async function startCalendar() {

  const events = await window.calendarAPI.getEvents()

  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    events: events
  })

  calendar.render()
}

const hoverSound = document.getElementById("hoverSound");

document.addEventListener("mouseover", (e) => {
  if (e.target.matches("button, .task_item, .fc-daygrid-day-frame")) {
    hoverSound.currentTime = 0;
    hoverSound.play();
  }
});


async function refreshCalendar() {

  const events = await window.calendarAPI.getEvents()

  calendar.removeAllEvents()
  calendar.addEventSource(events)
}


setInterval(refreshCalendar, 300000)

startCalendar()

function forceHighlightToday() {
    const todayFrame = document.querySelector('.fc-day-today .fc-daygrid-day-frame');
    const todayNumber = document.querySelector('.fc-day-today .fc-daygrid-day-number');

    if (todayFrame) {
        todayFrame.style.cssText = `
            background-color: #fabac6 !important;
            border: 3px solid #ffffff !important;
            border-radius: 15px !important;
            box-shadow: 0 6px 15px rgba(255, 77, 110, 0.29) !important;
            transform: scale(1.05) !important;
            z-index: 10 !important;
            position: relative !important;
        `;
    }
    
    if (todayNumber) {
        todayNumber.style.color = 'white';
    }
}

setTimeout(forceHighlightToday, 300);

document.addEventListener('click', (e) => {
    if (e.target.closest('.fc-prev-button, .fc-next-button, .fc-today-button')) {
        
        setTimeout(forceHighlightToday, 50); 
    }
});