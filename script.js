let keypad = document.getElementById('keypad');
let qwerty = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
]
qwerty.forEach(r => {
    r.forEach(l => {
        keypad.innerHTML += `<span id=${l} style="display: inline-block; width: 2vw;">${l}</span>`
    })
    keypad.innerHTML += '<br><br>'
})