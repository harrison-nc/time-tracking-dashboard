// get all the element in our document that has data-timeframe attribute
const timeFrameMenuItem = document.querySelectorAll("[data-timeframe]");

// starting at position zero
let position = 0;
// check that position is less than the number of element in the array
while (position < timeFrameMenuItem.length) {
  // if it is get the menu item at the position
  let menuItem = timeFrameMenuItem[position];
  // add event list for the menu item
  addTimeFrameClickLister(menuItem);
  // go to the next position (increase position by q)
  position = position + 1;
  // to back to while loop
}

function addTimeFrameClickLister(menuItem) {
  menuItem.addEventListener("click", function () {
    document.querySelectorAll('[aria-selected]')
      .forEach(element => element.removeAttribute('aria-selected'))

    menuItem.setAttribute("aria-selected", true);
    let timeFrame = menuItem.getAttribute("data-timeframe");
    displayTimeFrame(timeFrame);
  });
}

function displayTimeFrame(timeFrame) {
  getServerActivities(timeFrame);
}

function getServerActivities(timeFrame) {
  window
    .fetch("/data.json")
    .then(getJson)
    .then(function (activities) {
      showTimeFrameActivities(activities, timeFrame);
    })
    .catch(e => console.debug(e))
}

function getJson(response) {
  return response.json();
}


function showTimeFrameActivities(activities, timeFrame) {
  const element = document.querySelector("[data-activities]");
  let position = 0;
  let html = "";
  while (position < activities.length) {
    let activity = activities[position];
    let activityType = activity.title.toString().toLowerCase().replaceAll(' ', '-');
    let frames = activity["timeframes"];
    let frame = frames[timeFrame];
    html = html + `
        <article class="activity" data-activity-type="${activityType}">
          <div class="icon">
            <img src="./images/icon-${activityType}.svg" alt="">
          </div>
          <div class="activity-details">
            <p>
              <strong>${activity.title}</strong>
              <img src="./images/icon-ellipsis.svg" alt="">
            </p>
            <p>
              <span>${frame.current}hrs</span>
              <span>${getPreviousTimeframeLabel(timeFrame)} - ${frame.previous}hrs</span>
            </p>
          </div>
        </article>`;
    position = position + 1;
  }
  console.debug(html);
  element.innerHTML = html;
}

function getPreviousTimeframeLabel(timeFrame) {
  if (timeFrame === 'daily') return "Yesterday";
  else if (timeFrame === 'weekly') return "Last Week";
  else if (timeFrame === 'monthly') return "Last Month";
  else return "";
}
