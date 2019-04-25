// TO-DO: cleanup input reading, pad 0's

let button = document.getElementById('submit');
let minuteField = document.getElementById('minuteField');
let secondField = document.getElementById('secondField');

chrome.storage.sync.get({ minutes: '00', seconds: '30' }, function(settings) 
{
    minuteField.setAttribute('placeholder', settings.minutes);
    secondField.setAttribute('placeholder', settings.seconds);
    console.log('Current interval: ' + settings.minutes + ':' + settings.seconds);
})

button.addEventListener('click', function() 
{
    if (minuteField == '') minuteField = '00';
    if (secondField == '') secondField = '30';

    chrome.storage.sync.set( { minutes: minuteField.value, seconds: secondField.value }, function() 
    {
        alert('Interval set to ' + minuteField.value + ':' + secondField.value);
        console.log('minutes: ' + minuteField.value + ' seconds: ' + secondField.value);
    });
});
