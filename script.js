let words = wordList
let usedWords = []

if(localStorage.getItem('words') != null){
    words = JSON.parse(localStorage.getItem('words'))
}

if(localStorage.getItem('usedWords') != null){
    usedWords = JSON.parse(localStorage.getItem('usedWords'))
}

if(words.length == 1){
    words = words.concat(usedWords)
    usedWords = []
}

let random = Math.floor(Math.random() * words.length) // 0-1
usedWords.push(words[random])
const correctWord = words[random];
const index = words.indexOf(words[random]);
if (index > -1) {
    words.splice(index, 1);
}

localStorage.setItem('words', JSON.stringify(words));
localStorage.setItem('usedWords', JSON.stringify(usedWords));

let keypad = document.getElementById('keypad');
let qwerty = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
]
let alphabets = [
    'A', 'B', 'C', 'D', 'E', 'F',
    'G', 'H', 'I', 'J', 'K', 'L', 'N', 'M',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
    'W', 'X', 'Y', 'Z'
]
qwerty.forEach(r => {
    r.forEach(l => {
        keypad.innerHTML += `<span id=${l} style="display: inline-block; width: 2vw;">${l}</span>`
    })
    keypad.innerHTML += '<br><br>'
})

let attempt = 1;
let currentLetter = 1;
let currentInputId = attempt.toString() + currentLetter.toString() // '1' + '1' = '11' // '12'

const updateCurrentInputId = () => {
    currentInputId = attempt.toString() + currentLetter.toString()
}

let gameStatus = 'playing'

document.getElementById(currentInputId).focus()
document.getElementById(currentInputId).disabled = false

window.addEventListener('keydown', (e) => {
    if (alphabets.includes(e.key.toUpperCase()) && gameStatus == 'playing') { // check for letters 
        let input = document.getElementById(currentInputId)
        input.value = e.key.toUpperCase()
        if (currentLetter != 5) {
            input.disabled = true // older block gets disabled
            currentLetter = currentLetter + 1 // currentLetter = 2
            updateCurrentInputId()
            document.getElementById(currentInputId).disabled = false // new block gets enabled
            setTimeout(() => {
                document.getElementById(currentInputId).focus()
            }, 100)
        }
    } else if (e.keyCode == 8 && gameStatus == 'playing') { // check for backspace
        e.preventDefault()
        let input = document.getElementById(currentInputId)
        if (currentLetter != 1 && input.value == '') { // check if it's not the first letter and if the input is empty
            input.disabled = true
            currentLetter = currentLetter - 1
            updateCurrentInputId()
            document.getElementById(currentInputId).disabled = false // previous block gets enabled
            document.getElementById(currentInputId).value = '' // previous blocks value becomes ''
            setTimeout(() => {
                document.getElementById(currentInputId).focus()
            }, 100)
        } else { // if it's the first letter
            input.value = ''
        }
    } else if (e.keyCode == 13) { // check for enter key
        if (currentLetter == 5 && gameStatus == "playing" && document.getElementById(currentInputId).value != '') {
            let letter1 = document.getElementById(attempt.toString() + '1') // 1 + 1= '11' 
            let letter2 = document.getElementById(attempt.toString() + '2') // 1 + 2 = '12'
            let letter3 = document.getElementById(attempt.toString() + '3')
            let letter4 = document.getElementById(attempt.toString() + '4')
            let letter5 = document.getElementById(attempt.toString() + '5')
            let word = letter1.value + letter2.value + letter3.value + letter4.value + letter5.value
            if(words.includes(word.toLowerCase()) == false && usedWords.includes(word.toLowerCase()) == false){
                setTimeout(() => {
                    Toastify({
                        text: "Word not in list",
                        duration: 3000,
                        destination: "https://github.com/apvarun/toastify-js",
                        newWindow: true,
                        close: false,
                        gravity: "top", // `top` or `bottom`
                        position: "center", // `left`, `center` or `right`
                        stopOnFocus: false, // Prevents dismissing of toast on hover
                        style: {
                          background: "#b59f3b",
                        }
                      }).showToast();
                }, 100)
                return // breaks the function
            }
            if (word == correctWord.toUpperCase()) { // check if the word is correct
                let letters = [1,2,3,4,5]
                letters.forEach(i => { // i = 1,2,3,4,5
                    let input = document.getElementById(attempt.toString() + i.toString()) // '11', '12', '13', '14', '15'
                    input.disabled = true
                    document.getElementById(input.value).style.backgroundColor = 'rgb(22, 225, 110)' // changes color of keypad letter
                    input.style.backgroundColor = 'rgb(22, 225, 110)' // changes color of grid block
                })
                gameStatus = 'w'
                Toastify({
                    text: "You won",
                    duration: 3000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: false,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center` or `right`
                    stopOnFocus: false, // Prevents dismissing of toast on hover
                    style: {
                      background: "rgb(22, 225, 110)",
                    }
                  }).showToast();
            } else if (gameStatus != 'w') { // checks individual letters 
                let letters = [1,2,3,4,5]
                letters.forEach(i => {
                    let input = document.getElementById(attempt.toString() + i.toString())
                    if (input.value == correctWord[i-1].toUpperCase()) { // letter exists at correct position
                        document.getElementById(input.value).style.backgroundColor = 'rgb(22, 225, 110)' // keypad change
                        input.style.backgroundColor = 'rgb(22, 225, 110)' // block color change
                    } else {
                        if (correctWord.toUpperCase().split("").includes(input.value)) { // letter exists but not at correct position
                            document.getElementById(input.value).style.backgroundColor = '#b59f3b' // keypad change
                            input.style.backgroundColor = '#b59f3b' // block color change
                        } else { // letter doesn't exist in word
                            document.getElementById(input.value).style.backgroundColor = '#3a3a3c' // keypad change
                            input.style.backgroundColor = '#3a3a3c' // block color change
                        }
                    }
                })
                document.getElementById(currentInputId).disabled = true // last letter block disabled
                if (attempt == 5) {
                    gameStatus = "l"
                    Toastify({
                        text: `Oops! You lost. The word was ${correctWord.toUpperCase()}`,
                        duration: 3000,
                        destination: "https://github.com/apvarun/toastify-js",
                        newWindow: true,
                        close: false,
                        gravity: "top", // `top` or `bottom`
                        position: "center", // `left`, `center` or `right`
                        stopOnFocus: false, // Prevents dismissing of toast on hover
                        style: {
                          background: "#E61C34",
                        }
                      }).showToast();
                } else {
                    attempt = attempt + 1
                    currentLetter = 1
                    updateCurrentInputId()
                    document.getElementById(currentInputId).disabled = false
                    setTimeout(() => {
                        document.getElementById(currentInputId).focus()
                    }, 100)
                }
            }
        }
    }
})
