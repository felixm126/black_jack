// const start = document.querySelector('#startGame')
const startHand = document.querySelector('#startHand')
// const increase = document.querySelector('#increase')
// const decrease = document.querySelector('#decrease')
const hit = document.querySelector('#hit')
const stay = document.querySelector('#stay')
// const double = document.querySelector('#double')
const restart = document.querySelector('#restart')

const playerSum = document.querySelector('#playerSum')
const dealerSum = document.querySelector('#dealerSum')
//back of card img hidden for now
const hiddenCard = document.getElementById('hiddenCard')
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
		let cardsLeft = response.data.remaining
		if (cardsLeft <= 78) {
			restartGame() // Reshuffle if less than 1/4 of cards remain
		}
		return card
	} catch (error) {
		console.log(error)
	}
}

//deal card 4 times to simulate alternating dealt cards between dealer and player
async function dealNewHand() {
	try {
		for (let i = 1; i < 5; i++) {
			let card = await drawCard(1)
			if (card) {
				if (i % 2 !== 0) {
					playerCards.push(card)
					loadImage(card.image, playerCardsImage)
				} else {
					if (i === 2) {
						dealerCards.push(card)
						loadImage(card.image, dealerCardsImage)
					} else if (i === 4) {
						hiddenCard.style.display = 'none'
						dealerCards.push({ value: card.value })
						loadImage(card.image, dealerCardsImage)
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
			console.log(value)
			return 11
		} else if (value == 'KING' || value == 'QUEEN' || value == 'JACK') {
			return 10
		}
	}
	return parseInt(value)
}

function checkHandValue() {
	playerCards.forEach((card) => {
		playerTotal += getFaceValue(card.value)
	})

	dealerCards.forEach((card) => {
		dealerTotal += getFaceValue(card.value)
	})
	playerSum.textContent = `${playerTotal}`
	dealerSum.textContent = `${dealerTotal}`

	if (playerTotal === 21 && dealerTotal !== 21) {
		alert('BlackJack')
	} else if (dealerTotal === 21 && playerTotal !== 21) {
		alert('Dealer has blackjack! Try again?')
	} else if (playerTotal === 21 && dealerTotal === 21) {
		alert("That's unfortunate. You both have blackjack. Push")
	} else if (playerTotal > 21) {
		ableToHit = false
		roundOver = true
		alert('You Busted! Dealer wins!')
	}
}

function checkWin() {
	checkHandValue()
	let playerTotal = parseInt(playerSum.textContent)
	let dealerTotal = parseInt(dealerSum.textContent)

	if (playerTotal > 21) {
		ableToHit = false
		roundOver = true
		alert('You busted! Dealer wins!')
	} else if (dealerTotal > 21) {
		roundOver = true
		alert('Dealer busts! Player wins!')
	} else if (playerTotal > dealerTotal) {
		roundOver = true
		alert('Player wins!')
	} else if (dealerTotal > playerTotal) {
		roundOver = true
		alert('Dealer wins!')
	} else {
		ableToHit = false
		roundOver = true
		alert('Push!')
	}
}

async function dealersTurn() {
	if (!roundOver) {
		while (parseInt(dealerSum.textContent) < 17) {
			let drawnCard = await drawCard(1)
			dealerCards.push(drawnCard)
			if (dealerCards.length > 1) {
				loadImage(dealerCards[dealerCards.length - 1])
			}
			checkHandValue()
		}
		checkWin()
		roundOver = true
	}
}

function restartGame() {
	playerCards = []
	dealerCards = []

	playerCardsImage.innerHtml = ''
	dealerCardsImage.innerHtml = ''

	playerSum = 0
	dealerSum = ''

	newGame()
}

startHand.addEventListener('click', dealNewHand)

hit.addEventListener('click', async () => {
	if (ableToHit) {
		let drawnCard = await drawCard(1)
		playerCards.push(drawnCard)
		loadImage(drawnCard.image, playerCardsImage)
		checkWin()
	} else {
		roundOver = false
	}
})

stay.addEventListener('click', async () => {
	ableToHit = false
	roundOver = false
	hiddenCard.style.display = 'none'
	dealersTurn()
})

newGame()
