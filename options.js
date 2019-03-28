let interval = document.getElementById('intervalDiv');
chrome.storage.sync.set( { interval: interval }, function() {
    console.log('interval is ' + interval)
})