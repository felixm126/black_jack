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

const cardContainer = document.querySelector('.cardContainer')
const hiddenCard = document.getElementById('hiddenCard') //back of card img hidden for now
const playerCardsImage = document.querySelector('#playerCards')
const dealerCardsImage = document.querySelector('#dealerCards')

const apiUrl = 'https://deckofcardsapi.com/api/deck/'
const newDeck = 'new/shuffle/?deck_count=6'

let playerCards = []
let dealerCards = []
let player = 0
let dealer = 0
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

// api request to draw cards
async function drawCard(cards) {
	newGame()
	try {
		const response = await axios.get(`${apiUrl}${deckId}/draw/?count=${cards}`)

		let cardValue = response.data.cards.value
		let cardSuit = response.data.cards.suit
		let cardImage = response.data.cards.image
		let cardVal = getValue(cardValue)
		loadImage(cardImage)

		let cardsLeft = response.data.cards.remaining
		if (cardsLeft <= 78) {
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
					// If odds - will go to the player
					playerCards.push(card[0])
					loadImage(card[0].image, playerCardsImage)
				} else {
					//evens will go to dealer
					if (i === 4) {
						hiddenCard.style.display = 'block'
					}
					dealerCards.push(card[0])
					loadImage(card[0].image, dealerCardsImage)
				}
			}
		}
	} catch (error) {}
}

function loadImage(url, cardContainer) {
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
}

// get the Number value of the cards rank
function getValue(card) {
	let value = card

	if (isNaN(value)) {
		if (value == 'ACE') {
			return 11
		}
		return 10
	}
	return parseInt(value)
}

async function dealersTurn() {
	while (dealerSum < 17) {
		let drawnCard = await drawCard(1)
		dealerCards.push(drawnCard[0])
		loadImage(drawnCard[0].image, dealerCardsImage)
		getScore()
	}
	checkWin()
}

function checkWin() {
	if (playerSum > 21) {
		alert('You busted! Dealer wins!')
		playerSum.textContent = `${playerSum}`
	} else if (dealerSum > 21) {
		alert('Dealer busts! Player wins!')
	} else if (playerSum > dealerSum) {
		alert('Player wins!')
	} else if (dealerSum > playerSum) {
		alert('Dealer wins!')
	} else {
		alert('Push!')
	}
}

function restartGame() {
	playerCards = []
	dealerCards = []

	playerSum = 0
	dealerSum = ''
}

newGame()
