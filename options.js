let submit = document.getElementById('submit')
let addNewButton = document.getElementById('addNewSite')
let minuteField = document.getElementById('minuteField')
let secondField = document.getElementById('secondField')

chrome.storage.sync.get({ minutes: '01', seconds: '00'}, settings => {
    minuteField.setAttribute('placeholder', settings.minutes)
    secondField.setAttribute('placeholder', settings.seconds)
    console.log('Current interval: ' + settings.minutes + ':' + settings.seconds)
    chrome.storage.sync.get("perSiteSettings", value => {
        if (value == undefined) {
            // do none
        } else {
            // fill table of current site settings
        }
        console.log('Retrieved per site stetings: ', value)
    })
})

submit.addEventListener('click', () => {
    // check for blank inputs
    if (minuteField.value == '') minuteField.value = '01'
    if (secondField.value == '') secondField.value = '00'

    // pad with 0's if single digit
    if (minuteField.value.length < 2) minuteField.value = '0' + minuteField.value
    if (secondField.value.length < 2) secondField.value = '0' + secondField.value

    var perSiteSettings = {}
    $('#tbody > tr').each(function() {
        let website = $(this).find(".website").val()
        let siteMinutes = $(this).find(".siteMinuteField").val()
        let siteSeconds = $(this).find(".siteSecondField").val()
        perSiteSettings[website] = { minutes: siteMinutes, seconds: siteSeconds }
    })

    chrome.storage.sync.set({ minutes: minuteField.value, seconds: secondField.value, perSiteSettings: perSiteSettings }, () => {
        alert('Interval set to ' + minuteField.value + ':' + secondField.value)
        console.log('minutes: ' + minuteField.value + ' seconds: ' + secondField.value)
        console.log("Persite map: ", perSiteSettings)
    })
})

addNewButton.addEventListener('click', () => {
    let table = document.getElementById('per-site-table')
    let currentRow = table.insertRow(-1)

    let websiteField = document.createElement('input')
    websiteField.setAttribute('placeholder', 'https://www.google.com')
    websiteField.setAttribute('class', 'website')

    let minuteField = document.createElement('input')
    minuteField.setAttribute('class', 'siteMinuteField')
    minuteField.setAttribute('placeholder', '01')

    let colonElement = document.createElement('div')
    colonElement.innerHTML = ":"
    colonElement.setAttribute('class', 'colon')

    let secondField = document.createElement('input')
    secondField.setAttribute('class', 'siteSecondField')
    secondField.setAttribute('placeholder', '00')

    let currentCell = currentRow.insertCell(-1)
    currentCell.appendChild(websiteField)

    currentCell = currentRow.insertCell(-1)
    currentCell.appendChild(minuteField)

    currentCell = currentRow.insertCell(-1)
    currentCell.appendChild(colonElement)

    currentCell = currentRow.insertCell(-1)
    currentCell.appendChild(secondField)
})
