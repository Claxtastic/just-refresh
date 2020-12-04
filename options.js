let submit = document.getElementById('submit')
let addNewButton = document.getElementById('addNewSite')
let minuteField = document.getElementById('minuteField')
let secondField = document.getElementById('secondField')

chrome.storage.sync.get("perSiteSettings", settings => {
    if (settings != undefined) {
        for (const [website, intervalObject] of Object.entries(settings.perSiteSettings)) {
            if (website !== 'undefined') {
                createRow(-1)
                let firstRow = $('#tbody > tr').last()
                $(firstRow).find(".website").val(website)
                $(firstRow).find(".siteMinuteField").val(intervalObject.minutes)
                $(firstRow).find(".siteSecondField").val(intervalObject.seconds)
            }
        }
    }
})

chrome.storage.sync.get({ minutes: '01', seconds: '00'}, settings => {
    minuteField.setAttribute('placeholder', settings.minutes)
    minuteField.value = settings.minutes
    secondField.setAttribute('placeholder', settings.seconds)
    secondField.value = settings.seconds
    console.log(`Current interval: ${settings.minutes} : ${settings.seconds}`)
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
        if (website != "") {
            let siteMinutes = $(this).find(".siteMinuteField").val()
            let siteSeconds = $(this).find(".siteSecondField").val()
            perSiteSettings[website] = { minutes: siteMinutes, seconds: siteSeconds }
        }
    })

    chrome.storage.sync.set({ minutes: minuteField.value, seconds: secondField.value, perSiteSettings: perSiteSettings }, () => {
        alert(`Saved all settings successfully`)
    })
})

addNewButton.addEventListener('click', () => createRow(-1))

function createRow(rowIndex) {
    let table = document.getElementById('per-site-table')
    let currentRow = table.insertRow(rowIndex)

    let websiteField = document.createElement('input')
    websiteField.setAttribute('placeholder', 'https://www.google.com')
    websiteField.setAttribute('class', 'website')

    let minuteField = document.createElement('input')
    minuteField.setAttribute('class', 'siteMinuteField')
    minuteField.setAttribute('placeholder', '01')
    minuteField.setAttribute('maxlength', 2)

    let colonElement = document.createElement('div')
    colonElement.innerHTML = ":"
    colonElement.setAttribute('class', 'colon')

    let secondField = document.createElement('input')
    secondField.setAttribute('class', 'siteSecondField')
    secondField.setAttribute('placeholder', '00')
    secondField.setAttribute('maxlength', 2)

    let removeButton = document.createElement('input')
    removeButton.setAttribute('class', 'remove')
    removeButton.setAttribute('id', 'removeButton')
    removeButton.setAttribute('type', 'image')
    removeButton.setAttribute('src', '/images/remove.svg')
    removeButton.addEventListener('click', () => removeRow(removeButton))

    let currentCell = currentRow.insertCell(-1)
    currentCell.appendChild(websiteField)

    currentCell = currentRow.insertCell(-1)
    currentCell.appendChild(minuteField)

    currentCell = currentRow.insertCell(-1)
    currentCell.appendChild(colonElement)

    currentCell = currentRow.insertCell(-1)
    currentCell.appendChild(secondField)

    currentCell = currentRow.insertCell(-1)
    currentCell.appendChild(removeButton)
}

function removeRow(removeButton) {
    $(removeButton).closest("tr").remove()
}
