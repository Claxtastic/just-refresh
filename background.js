let refreshers = {}

// Clicked extension icon
chrome.browserAction.onClicked.addListener(tab => {
  createOrDeleteRefresher(String(tab.id))
})

// Command toggle keybind pressed
chrome.commands.onCommand.addListener(command => {
  // Because this is a command we don't have a tab as the callback parm, so query for active tab
  chrome.tabs.query({active: true, lastFocusedWindow: true, currentWindow: true}, tabs => {
    createOrDeleteRefresher(String(tabs[0].id))
  })
})

// Refreshing tab was closed remove it from refreshers
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  try {
    clearInterval(refreshers[String(tabId)].refresh)
    delete refreshers[String(tabId)]
  } catch (typeError) {
    console.log('Caught ' + typeError)
  }
})

function createOrDeleteRefresher(strId) {
  // if ID is already in refreshers list
  if (strId in refreshers) {
    // delete refresher a
    deleteRefresher(refreshers, strId)
    return
  }
  // else this tab has no refresher create one

  var tabUrl = ""
  chrome.tabs.query({active: true, lastFocusedWindow: true, currentWindow: true}, tabs => { tabUrl = tabs[0].url })

  var perSiteSettings
  chrome.storage.sync.get("perSiteSettings", perSiteObject => { perSiteSettings = perSiteObject })
  
  // Get stored interval; default to 01:00 if none
  chrome.storage.sync.get({ minutes: '01', seconds: '00' }, settings => {
    let minutes = settings.minutes
    let seconds = settings.seconds
      
    if (perSiteSettings != undefined && tabUrl in perSiteSettings.perSiteSettings) {
      let siteSettings = perSiteSettings.perSiteSettings[tabUrl]
      // use those site specific settings
      minutes = siteSettings.minutes
      seconds = siteSettings.seconds
      console.log(`Using site specific settings for url ${tabUrl}; ${minutes}:${seconds}`)
    }

    let ms = (minutes * 60 * 1000) + (seconds * 1000) 
    createRefresher(refreshers, strId, ms)
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
