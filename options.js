let button = document.getElementById('submit');

chrome.storage.sync.get({ minutes: '00', seconds: '30' }, function(settings) 
{
    console.log('Current interval: ' + settings.minutes + ':' + settings.seconds);
})

button.addEventListener('click', function() 
{
    let minuteField = document.getElementById('minuteField').value;
    let secondField = document.getElementById('secondField').value;

    if (minuteField == '') minuteField = '00';
    if (secondField == '') secondField = '30';

    // definitely some work to do on handling input

    chrome.storage.sync.set( { minutes: minuteField, seconds: secondField }, function() 
    {
        alert('Interval set to ' + minuteField + ':' + secondField);
        console.log('minutes: ' + minuteField + ' seconds: ' + secondField);
    });
});