// Global variables here
const button = document.querySelectorAll('.buttonContainer')

const dealerNum = 0
const playerNum = 0
const numDealerAces = 0
const numPlayerAces = 0

button.addEventListener('click', async () => {
	let result = await axios.get(
		'https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6'
	)
	console.log(result.data)

	let startGame = document.querySelector('#startButton')
	let increase = document.querySelector('#upButton')
	let decrease = document.querySelector('#downButton')
	let hit = document.querySelector('#hitButton')
	let stay = document.querySelector('#stayButton')
	let double = document.querySelector('#doubleButton')
	let restart = document.querySelector('#restartButton')
})
// create function for when windows loads

// function to start game

//function to restart game

//shuffle deck
