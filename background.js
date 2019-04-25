let refreshers = {};

// Clicked extension icon
chrome.browserAction.onClicked.addListener(function(tab) 
{
  // Get stored interval; default to 00:30 if none
  chrome.storage.sync.get({ minutes: '00', seconds: '30' }, function(settings) 
  {
    let ms = (settings.minutes * 60 * 1000) + (settings.seconds * 1000); 
    let strId = String(tab.id);
    if (refreshers.hasOwnProperty(strId)) {
      // This tab is already has a refresher; remove it
      deleteRefresher(refreshers, strId);
    } else {
      // This tab has no refresher; create one
      createRefresher(refreshers, strId, ms);
    }
  });
});

// Refreshing tab was closed; remove it from refreshers
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  try {
    clearInterval(refreshers[String(tabId)].refresh);
    delete refreshers[String(tabId)];
  } catch (typeError) {
    console.log('Caught ' + typeError);
  }
});

function createRefresher(refreshers, strId, ms) {
  // Get a readable version of the interval, as a string in seconds
  let sec = String(ms / 1000);

  let refresh = setInterval(function() {
    if (refreshers[strId].tick > 0) {
      // Tab is at least one second away from refreshing; decrement the tick and set the badgeText
      sec = String(parseInt(refreshers[strId].tick--));
      chrome.browserAction.setBadgeText({text: sec, tabId: parseInt(strId)});
    } else {
      // Tab is ready to refresh; assign tick to the interval and refresh
      refreshers[strId].tick = refreshers[strId].interval;
      chrome.tabs.reload(parseInt(strId));
    }
  }, 1000);

  // Place refresher data for this tab in object
  refreshers[strId] = {
    "interval" : sec,
    "tick" : sec,
    "refresh" : refresh
  };
}

function deleteRefresher(refreshers, strId) {
  // Remove from this tab's data from refreshers
  chrome.browserAction.setBadgeText({text: "", tabId: parseInt(strId)});
  // Stop refresh loop
  clearInterval(refreshers[strId].refresh);
  delete refreshers[strId];
}
