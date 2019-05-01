let button = document.getElementById('submit');
let minuteField = document.getElementById('minuteField');
let secondField = document.getElementById('secondField');

chrome.storage.sync.get({ minutes: '01', seconds: '00' }, function(settings) 
{
    minuteField.setAttribute('placeholder', settings.minutes);
    secondField.setAttribute('placeholder', settings.seconds);
    console.log('Current interval: ' + settings.minutes + ':' + settings.seconds);
})

button.addEventListener('click', function() 
{
    // check for blank inputs
    if (minuteField.value == '') minuteField.value = '01';
    if (secondField.value == '') secondField.value = '00';

    // pad with 0's if single digit
    if (minuteField.value.length < 2) minuteField.value = '0' + minuteField.value;
    if (secondField.value.length < 2) secondField.value = '0' + secondField.value;

    chrome.storage.sync.set( { minutes: minuteField.value, seconds: secondField.value }, function() 
    {
        alert('Interval set to ' + minuteField.value + ':' + secondField.value);
        console.log('minutes: ' + minuteField.value + ' seconds: ' + secondField.value);
    });
});
