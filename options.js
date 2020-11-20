let submit = document.getElementById('submit');
let addNewButton = document.getElementById('addNewSite')
let minuteField = document.getElementById('minuteField');
let secondField = document.getElementById('secondField');

chrome.storage.sync.get({ minutes: '01', seconds: '00' }, function(settings) 
{
    minuteField.setAttribute('placeholder', settings.minutes);
    secondField.setAttribute('placeholder', settings.seconds);
    console.log('Current interval: ' + settings.minutes + ':' + settings.seconds);
})

submit.addEventListener('click', function() {
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
    })
})


addNewButton.addEventListener('click', function() {
    var table = document.getElementById('per-site-table')
    var currentIndex = table.rows.length
    var currentRow = table.insertRow(-1)

    var websiteField = document.createElement('input')
    websiteField.setAttribute('placeholder', 'https://www.google.com')
    websiteField.setAttribute('class', 'website')

    var minuteField = document.createElement('input')
    minuteField.setAttribute('placeholder', '01')

    var colonElement = document.createElement('div')
    colonElement.innerHTML = ":"
    colonElement.setAttribute('class', 'colon')

    var secondField = document.createElement('input')
    secondField.setAttribute('placeholder', '00')

    var currentCell = currentRow.insertCell(-1)
    currentCell.appendChild(websiteField)

    currentCell = currentRow.insertCell(-1)
    currentCell.appendChild(minuteField)

    currentCell = currentRow.insertCell(-1)
    currentCell.appendChild(colonElement)

    currentCell = currentRow.insertCell(-1)
    currentCell.appendChild(secondField)
})
