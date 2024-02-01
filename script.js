const startHand = document.querySelector('#startHand')
const hit = document.querySelector('#hit')
const stay = document.querySelector('#stay')
const restart = document.querySelector('#restart')
const playerSum = document.querySelector('#playerSum')
const dealerSum = document.querySelector('#dealerSum')

const hiddenCard = document.getElementById('hiddenCard')
const playerCardsImage = document.querySelector('.playerCards')
const dealerCardsImage = document.querySelector('.dealerCards')

const apiUrl = 'https://deckofcardsapi.com/api/deck/'
const newDeck = 'new/shuffle/?deck_count=6'
const bank = document.getElementById('bankRoll')

let bankCounter = 500
let playerCards = []
let dealerCards = []
let ableToHit = true
let isRoundOver = true
let deckId = ''
let hiddenCardUrl = ''
let backCardUrl = 'https://www.deckofcardsapi.com/static/img/back.png'

document.addEventListener('DOMContentLoaded', () => {
	const toggleButton = document.getElementById('toggleButton')

	toggleButton.addEventListener('click', () => {
		startHand.classList.toggle('buttonContainer')
		hit.classList.toggle('buttonContainer')
		stay.classList.toggle('buttonContainer')
		restart.classList.toggle('buttonContainer')
		toggleButton.style.display = 'none'
	})
})

async function newGame() {
	try {
		const response = await axios.get(`${apiUrl}${newDeck}`)
		deckId = response.data.deck_id
	} catch (error) {
		console.log('Error starting new game', error)
	}
}

// api request to draw cards
async function drawCard(cards) {
	try {
		const response = await axios.get(`${apiUrl}${deckId}/draw/?count=${cards}`)
		let card = response.data.cards[0] // Accessing the first card from the response
		let cardsLeft = response.data.remaining

		if (cardsLeft <= 78) {
			await newGame() // Reshuffle if less than 1/4 of cards remain
		}
		return card
	} catch (error) {
		console.log(error)
	}
}

// Draw a card 4 times to simulate alternating dealt cards between dealer and player
async function dealNewHand() {
	ableToHit = true
	isRoundOver = false
	playerCards = []
	dealerCards = []
	hiddenCard.innerHTML = ''
	const backImg = document.createElement('img')
	backImg.src = backCardUrl
	hiddenCard.appendChild(backImg)

	try {
		for (let i = 0; i < 4; i++) {
			let card = await drawCard(1)
			if (i % 2 === 0) {
				playerCards.push(card)
				loadImage(card.image, playerCardsImage)
			} else {
				dealerCards.push(card)
				if (i === 1) {
					hiddenCardUrl = card.image
				} else if (i === 3) {
					loadImage(card.image, dealerCardsImage)
				}
			}
		}
		updateHandTotal()
	} catch (error) {
		console.log('Error in dealing new hand:', error)
	}
}

function updateHandTotal() {
	const playerTotal = checkHandValue(playerCards)
	playerSum.textContent = playerTotal.toString()

	const hideDealerCard = !isRoundOver
	const dealerTotal = checkHandValue(dealerCards, !isRoundOver)

	dealerSum.textContent = dealerTotal.toString()
	if (hideDealerCard) {
		dealerSum.textContent = '??'
	} else {
		dealerSum.textContent = dealerTotal.toString()
	}
}

function playersTurn() {
	if (!ableToHit || isRoundOver) {
		return
	}
}

async function dealersTurn() {
	if (!ableToHit || isRoundOver) {
		// Reveal the hidden second dealer card
		const hiddenImg = hiddenCard.querySelector('img')
		if (hiddenImg) {
			hiddenImg.src = hiddenCardUrl
		}
		let dealerTotal = checkHandValue(dealerCards, true)
		dealerSum.textContent = dealerTotal.toString()

		if (checkHandValue(playerCards) > 21) {
			checkWin()
		} else {
			while (dealerTotal < 17) {
				let drawnCard = await drawCard(1)
				if (drawnCard) {
					dealerCards.push(drawnCard)
					loadImage(drawnCard.image, dealerCardsImage)
					dealerTotal = checkHandValue(dealerCards, true)
					dealerSum.textContent = dealerTotal.toString()
				}
			}

			if (dealerTotal > 21) {
				alert('Dealer busts! Player wins!')
			}
			checkWin()
		}
	}
}

// Check the number value of the cards rank in total
function checkHandValue(cards, hiddenCard = false) {
	let value = 0
	let numAces = 0

	cards.forEach((card, i) => {
		if (card.value == 'ACE') {
			numAces += 1
			value += 11
		} else if (
			card.value == 'KING' ||
			card.value == 'QUEEN' ||
			card.value == 'JACK'
		) {
			value += 10
		} else {
			value += parseInt(card.value)
		}
	})
	while (value > 21 && numAces > 0) {
		value -= 10
		numAces -= 1
	}
	return value
}

function checkWin() {
	const playerTotal = checkHandValue(playerCards)
	const dealerTotal = checkHandValue(dealerCards, false)

	if (playerTotal > 21) {
		alert('You Busted! Another Hand?')
	} else if (dealerTotal > 21 && playerTotal <= 21) {
		alert('Dealer busts! You win!')
	} else if (playerTotal == dealerTotal) {
		alert('How Unlucky... Push')
	} else if (playerTotal > dealerTotal && playerTotal <= 21) {
		alert('Nice Hand!')
	} else {
		alert('Dealer wins!')
	}
	isRoundOver = true
}

function loadImage(url, cardContainer) {
	const image = new Image(200, 200)
	image.src = url

	image.addEventListener('load', () => {
		cardContainer.appendChild(image)
	})
	image.addEventListener('error', () => {
		const errMsg = document.createElement('output')
		errMsg.value = `Error loading image at ${url}`
		cardContainer.append(errMsg)
	})
	image.crossOrigin = 'anonymous'
	image.alt = ''
}

function restartGame() {
	playerCards = []
	dealerCards = []
	ableToHit = true
	isRoundOver = false
	bankCounter = 500
	bank.textContent = `Bankroll: $${bankCounter}`
	hiddenCard.innerHTML = ''
	playerCardsImage.innerHTML = ''
	dealerCardsImage.innerHTML = ''

	updateHandTotal()
	dealNewHand()
}

startHand.addEventListener('click', restartGame)

hit.addEventListener('click', async () => {
	if (ableToHit && checkHandValue(playerCards) <= 21) {
		const drawnCard = await drawCard(1)
		if (drawnCard) {
			playerCards.push(drawnCard)
			loadImage(drawnCard.image, playerCardsImage)
			updateHandTotal()
			if (checkHandValue(playerCards) > 21) {
				ableToHit = false
				isRoundOver = true
				dealersTurn()
			}
		}
	} else if (!ableToHit) {
		alert('Cannot hit.')
	}
})

stay.addEventListener('click', () => {
	ableToHit = false
	isRoundOver = true
	dealersTurn()
})

restart.addEventListener('click', restartGame)

newGame()
