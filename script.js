const startHand = document.querySelector('#startHand')
const hit = document.querySelector('#hit')
const stay = document.querySelector('#stay')
const playerSum = document.querySelector('#playerSum')
const dealerSum = document.querySelector('#dealerSum')

const hiddenCard = document.getElementById('hiddenCard')
const playerCardsImage = document.querySelector('.playerCards')
const dealerCardsImage = document.querySelector('.dealerCards')

const apiUrl = 'https://deckofcardsapi.com/api/deck/'
const newDeck = 'new/shuffle/?deck_count=6'

let playerCards = []
let dealerCards = []

let bank = document.getElementById('bankRoll')

let ableToHit = true
let isRoundOver = true
let deckId = ''
let hiddenCardUrl = ''
let backCardUrl = 'https://www.deckofcardsapi.com/static/img/back.png'

// function to start game
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
		let card = response.data.cards[0]
		let cardsLeft = response.data.remaining

		if (cardsLeft <= 78) {
			await newGame() // Reshuffle if less than 1/4 of cards remain
		}
		return card
	} catch (error) {
		console.log(error)
	}
}

async function dealNewHand() {
	ableToHit = true
	isRoundOver = false

	playerCards = []
	dealerCards = []
	hiddenCard.innerHTML = ''

	const backImg = document.createElement('img')
	backImg.src = backCardUrl
	hiddenCard.appendChild(backImg)

	updateHandTotal()

	try {
		for (let i = 0; i < 4; i++) {
			let card = await drawCard(1)
			if (card) {
				if (i % 2 === 0) {
					playerCards.push(card)
					loadImage(card.image, playerCardsImage)
				} else {
					dealerCards.push(card)
					if (i === 1) {
						hiddenCardUrl = card.image
					} else if (i == 3) {
						loadImage(card.image, dealerCardsImage)
					}
				}
			} else {
				console.log('No card Drawn')
			}
		}
		updateHandTotal()
	} catch (error) {
		console.log('error in deal', error)
	}
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

function updateHandTotal() {
	if (isRoundOver) {
		playerSum.textContent = '0'
		dealerSum.textContent = '0'
		playerCards = []
		dealerCards = []
		ableToHit = true
		isRoundOver = false

		hiddenCard.style.display = 'block'
	} else {
		const playerTotal = checkHandValue(playerCards)
		const dealerTotal = checkHandValue(dealerCards, true)

		playerSum.textContent = playerTotal.toString()
		dealerSum.textContent = dealerTotal.toString()
	}
}

function checkHandValue(cards, hideCard = true) {
	let value = 0
	let numAces = 0

	cards.forEach((card, i) => {
		if (i === 3 && hideCard) {
			return
		}
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

async function dealersTurn() {
	const hiddenImg = hiddenCard.querySelector('img')
	hiddenImg.src = hiddenCardUrl

	let dealerTotal = checkHandValue(dealerCards, false)
	dealerSum.textContent = dealerTotal.toString()

	while (dealerTotal < 17) {
		try {
			const drawnCard = await drawCard(1)
			if (drawnCard) {
				dealerCards.push(drawnCard)
				loadImage(drawnCard.image, dealerCardsImage)
				dealerTotal = checkHandValue(dealerCards, false)
				dealerSum.textContent = dealerTotal.toString()
			}
		} catch (error) {
			console.log(error)
		}
	}
	checkWin()
}

function checkWin() {
	const playerTotal = checkHandValue(playerCards)
	const dealerTotal = checkHandValue(dealerCards)

	if (playerTotal > 21) {
		ableToHit = false
		isRoundOver = true
		alert('You busted! Dealer wins!')
		console.log('You Busted! Dealer wins!')
	} else if (dealerTotal > 21) {
		ableToHit = false
		isRoundOver = true
		alert('Dealer busts! Player wins!')
		console.log('Player wins!')
	} else if (playerTotal > dealerTotal) {
		ableToHit = false
		isRoundOver = true
		alert('Player wins!')
	} else if (dealerTotal > playerTotal) {
		ableToHit = false
		isRoundOver = true
		alert('Dealer wins!')
	} else {
		ableToHit = false
		isRoundOver = true
		alert('Push!')
	}
}

startHand.addEventListener('click', dealNewHand)

hit.addEventListener('click', async () => {
	if (checkHandValue(playerCards) > 21) {
		ableToHit = false
		isRoundOver = true
		alert('Cannot hit again.')
	} else {
		ableToHit = true
		isRoundOver = false
		const drawnCard = await drawCard(1)
		playerCards.push(drawnCard)
		loadImage(drawnCard.image, playerCardsImage)
		updateHandTotal(playerCards)
	}
})

stay.addEventListener('click', () => {
	ableToHit = false
	isRoundOver = false
	dealersTurn()
})

newGame()
