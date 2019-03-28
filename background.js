function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function reload(ms) {
  var toggleOff = false;
  chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
    console.log('Waiting ' + ms + ' miliseconds for next refresh');
    chrome.tabs.reload(tabs[0].id);
    while (!toggleOff) 
    {
      await sleep(ms);
      console.log(ms + ' miliseconds later');
      chrome.browserAction.onClicked.addListener(function(tabs)
        {
          toggleOff = true;
        });
    }
  });
}

chrome.browserAction.onClicked.addListener(function(tabs) 
{
  chrome.storage.sync.get({ minutes: '00', seconds: '30' }, function(settings) 
  {
    let minutes = settings.minutes;
    let seconds = settings.seconds;
    let ms = (settings.minutes / 1000) + (settings.seconds * 1000); 
    reload(ms)
  });
});