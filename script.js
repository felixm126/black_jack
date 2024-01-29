const start = document.querySelector('#startGame')
const startHand = document.querySelector('#startHand')
const increase = document.querySelector('#increase')
const decrease = document.querySelector('#decrease')
const hit = document.querySelector('#hit')
const stay = document.querySelector('#stay')
const double = document.querySelector('#double')
const restart = document.querySelector('#restart')

const playerSum = document.querySelector('#playerSum')
const dealerSum = document.querySelector('#dealerSum')
//back of card img hidden for now
const hiddenCard = document.getElementById('hiddenCard')
const playerCardsImage = document.querySelector('#playerCards')
const dealerCardsImage = document.querySelector('#dealerCards')

const apiUrl = 'https://deckofcardsapi.com/api/deck/'
const newDeck = 'new/shuffle/?deck_count=6'

let playerCards = []
let dealerCards = []
let playerNumAces = 0
let dealerNumAces = 0
let ableToHit = true
let deckId = ''

// function to start game
function newGame() {
	startHand.addEventListener('click', async () => {
		try {
			const response = await axios.get(`${apiUrl}${newDeck}`)
			deckId = response.data.deck_id
		} catch (error) {}
	})
}

// api request to draw number of cards
async function drawCard(numCards) {
	newGame()
	try {
		const response = await axios.get(
			`${apiUrl}${deckId}/draw/?count=${numCards}`
		)

		let cardValue = response.data.cards.value
		let cardSuit = response.data.cards.suit
		let cardImage = response.data.cards.image
		let cardVal = getValue(cardValue)
		loadImage(cardImage)

		let numCardsLeft = response.data.cards.remaining
		if (numCardsLeft <= 78) {
			// if less than 1/4 of card remain, reshuffle.
			restartGame()
		}
	} catch (error) {}
}

// Draw a card 4 times to simulate alternating dealt cards between dealer and player
async function dealNewHand() {
	try {
		for (let i = 1; i < 5; i++) {
			let card = await drawCard(1)
			if (card.length > 0) {
				if (i % 2 !== 0) {
					// odds will go to the player
					playerCards.push(card[0])
					loadImage(card[0].image, playerCardsImage)
				} else {
					//evens will go to dealer
					if (i === 4) {
						hiddenCard.style.display = 'none'
					}
					dealerCards.push(card[0])
					loadImage(card[0].image, dealerCardsImage)
				}
			}
		}
	} catch (error) {}
}

function loadImage(url, container) {
	const image = new Image(200, 200)
	image.addEventListener('load', () => cardImageUrl.prepend(image))
	image.addEventListener('error', () => {
		const errMsg = document.createElement('output')
		errMsg.value = `error loading image at ${url}`
		imageUrl.append(errMsg)
	})
	image.crossOrigin = 'anonymous'
	image.altalt = ''
	image.src = url
	return url
}

// get the Number value of the cards rank
function getValue(value) {
	let val = value
	if (isNaN(val)) {
		if (value == 'ACE') return 11
	}
	return 10
}

function restartGame() {
	// logic to restart the game
}

// dealing with Aces

newGame()
