function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var reload = function(ms, TOGGLE) {
  chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
    console.log('Waiting ' + ms + ' miliseconds for next refresh');
    while (TOGGLE) {
      await sleep(ms);
      if (TOGGLE) {
        console.log(ms + ' miliseconds later');
        chrome.tabs.reload(tabs[0].id);
      }
    }
  }); 
}

chrome.browserAction.onClicked.addListener(function(tabs) 
{
  chrome.storage.sync.get({ minutes: '00', seconds: '30' }, async function(settings) 
  {
    var TOGGLE = false;
    TOGGLE = !TOGGLE;
    let minutes = settings.minutes;
    let seconds = settings.seconds;
    let ms = (settings.minutes / 1000) + (settings.seconds * 1000); 
    await reload(ms, TOGGLE);
    // else remove it from a global list of reloading tabs?
  });
});