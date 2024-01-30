const startHand = document.querySelector('#startHand')
const hit = document.querySelector('#hit')
const stay = document.querySelector('#stay')
const restart = document.querySelector('#restart')

const playerSum = document.querySelector('#playerSum')
const dealerSum = document.querySelector('#dealerSum')

const hiddenCard = document.getElementById('hiddenCard') //back of card img hidden for now
const playerCardsImage = document.querySelector('.playerCards')
const dealerCardsImage = document.querySelector('.dealerCards')

const apiUrl = 'https://deckofcardsapi.com/api/deck/'
const newDeck = 'new/shuffle/?deck_count=6'

let playerCards = []
let dealerCards = []

let playerTotal = 0
let dealerTotal = 0

let ableToHit = true
let roundOver = true
let deckId = ''

// function to start game
async function newGame() {
	try {
		const response = await axios.get(`${apiUrl}${newDeck}`)
		deckId = response.data.deck_id
	} catch (error) {
		console.log(error)
	}
}

// api request to draw cards
async function drawCard(cards) {
	try {
		const response = await axios.get(`${apiUrl}${deckId}/draw/?count=${cards}`)
		let card = response.data.cards[0]
		let cardsLeft = response.data.cards.remaining
		if (cardsLeft <= 78) {
			// if less than 1/4 of card remain, reshuffle.
			restartGame()
		}
		return card
	} catch (error) {
		console.log(error)
	}
}

// Draw a card 4 times to simulate alternating dealt cards between dealer and player
async function dealNewHand() {
	try {
		for (let i = 1; i < 5; i++) {
			let card = await drawCard(1)
			if (card) {
				// Check if the card object is not undefined
				if (i % 2 !== 0) {
					playerCards.push(card)
					loadImage(card.image, playerCardsImage)
				} else {
					dealerCards.push(card)
					loadImage(card.image, dealerCardsImage)
					if (i === 4) {
						hiddenCard.style.display = 'block'
					}
				}
			} else {
				console.log('No card Drawn')
			}
		}
	} catch (error) {
		console.log(error)
	}
}

function loadImage(url, cardContainer) {
	const image = new Image(200, 200)
	image.src = url

	image.addEventListener('load', () => {
		cardContainer.prepend(image)
	})
	image.addEventListener('error', () => {
		const errMsg = document.createElement('output')
		errMsg.value = `Error loading image at ${url}`
		cardContainer.append(errMsg)
	})
	image.crossOrigin = 'anonymous'
	image.alt = ''
}

// get the Number value of the cards rank
function getFaceValue(card) {
	let value = card

	if (isNaN(value)) {
		if (value == 'ACE') {
			return 11
		}
		return 10
	}
	return parseInt(value)
}

function checkAce(card) {
	if (card[0] == 'ACE') {
		return 1
	}
	return 0
}

function checkHandValue() {
	let playerTotal = 0
	let dealerTotal = 0

	playerCards.forEach((card) => {
		playerTotal += getFaceValue(card.value)
	})

	dealerCards.forEach((card) => {
		dealerTotal += getFaceValue(card.value)
	})

	playerSum.textContent = `${playerTotal}`
	dealerSum.textContent = `${dealerTotal}`
}

function checkWin() {
	checkHandValue()
	let playerTotal = parseInt(playerSum.textContent)
	let dealerTotal = parseInt(dealerSum.textContent)

	if (playerTotal > 21) {
		alert('You busted! Dealer wins!')
		playerSum.textContent = `${playerSum}`
		console.log('You Busted! Dealer wins!')
	} else if (dealerTotal > 21) {
		alert('Dealer busts! Player wins!')
		console.log('Player wins!')
	} else if (playerTotal > dealerTotal) {
		alert('Player wins!')
	} else if (dealerTotal > playerTotal) {
		alert('Dealer wins!')
	} else {
		alert('Push!')
	}
}

async function dealersTurn() {
	if (!roundOver) {
		checkHandValue()
		while (dealerSum < 17) {
			let drawnCard = await drawCard(1)
			dealerCards.push(drawnCard[0])
			loadImage(drawnCard[0].image, dealerCardsImage)
			checkHandValue()
		}
		checkWin()
	}
}

startHand.addEventListener('click', dealNewHand)

hit.addEventListener('click', async () => {
	if (ableToHit) {
		let drawnCard = await drawCard(1)
		playerCards.push(drawnCard[0])
		loadImage(drawnCard[0].image, playerCardsImage)
		checkHandValue()
	}
	return
})

stay.addEventListener('click', async () => {
	ableToHit = false
	dealersTurn()
})

function restartGame() {
	playerCards = []
	dealerCards = []

	playerCardsImage.innerHtml = ''
	dealerCardsImage.innerHtml = ''

	playerSum = 0
	dealerSum = ''

	newGame()
}
newGame()
