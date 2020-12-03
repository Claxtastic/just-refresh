let refreshers = {}

// Clicked extension icon
chrome.browserAction.onClicked.addListener(function(tab) 
{
  createOrDeleteRefresher(String(tab.id))
})

// Command toggle keybind pressed
chrome.commands.onCommand.addListener(function(command) {
  // Because this is a command we don't have a tab as the callback parm, so query for active tab
  chrome.tabs.query({active: true}, function(tabs) {
    createOrDeleteRefresher(String(tabs[0].id))
  })
})

// Refreshing tab was closed remove it from refreshers
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  try {
    clearInterval(refreshers[String(tabId)].refresh)
    delete refreshers[String(tabId)]
  } catch (typeError) {
    console.log('Caught ' + typeError)
  }
})

function createOrDeleteRefresher(strId) {
  // Get stored interval default to 01:00 if none
  chrome.storage.sync.get({ minutes: '01', seconds: '00' }, function(settings) 
  {
    let ms = (settings.minutes * 60 * 1000) + (settings.seconds * 1000) 
    if (refreshers.hasOwnProperty(strId)) {
      // This tab is already has a refresher remove it
      deleteRefresher(refreshers, strId)
    } else {
      // This tab has no refresher create one
      createRefresher(refreshers, strId, ms)
    }
  })
}

function getMMSS(ms) {
  // create Date object for milliseconds, and return a nicely formatted mm:ss string
  let date = new Date(ms)
  var mm = String(date.getMinutes())
  var ss = String(date.getSeconds())
  if (date.getMinutes() < 10) {
    // pad minutes < 10 with a 0
    mm = '0' + mm
  } if (date.getSeconds() < 10) {
    // pad seconds < 10 with a 0
    ss = '0' + ss
  }
  return mm + ':' + ss
}

function createRefresher(refreshers, strId, ms) {
  // Get a readable version of the interval, as a string in seconds
  // let totalSeconds = String(ms / 1000)
  let sec = String(ms / 1000)

  let refresh = setInterval(function() {
    if (refreshers[strId].tick > 0) {
      // Tab is at least one second away from refreshing decrement the tick and set the badgeText
      sec = String(parseInt(refreshers[strId].tick--))
      var mmss = getMMSS(sec * 1000)

      chrome.browserAction.setBadgeText({text: mmss, tabId: Number(strId)})
    } else {
      // Tab is ready to refresh assign tick to the interval and refresh
      refreshers[strId].tick = refreshers[strId].interval
      chrome.tabs.reload(parseInt(strId))
    }
  }, 1000)

  // Place refresher data for this tab in object
  refreshers[strId] = {
    "interval" : sec,
    "tick" : sec,
    "refresh" : refresh
  }
}

function deleteRefresher(refreshers, strId) {
  // Remove from this tab's data from refreshers
  chrome.browserAction.setBadgeText({text: "", tabId: parseInt(strId)})
  // Stop refresh loop
  clearInterval(refreshers[strId].refresh)
  delete refreshers[strId]
}
