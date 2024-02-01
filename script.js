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
		alert('Error 1')
	}
}

// api request to draw cards
async function drawCard(cards) {
	try {
		const response = await axios.get(`${apiUrl}${deckId}/draw/?count=${cards}`)
		const card = response.data.cards[0] // Accessing the first card from the response
		const cardsLeft = response.data.remaining

		if (cardsLeft <= 78) {
			await newGame() // Reshuffle if less than 1/4 of cards remain
		}
		return card
	} catch (error) {
		alert('Error 2')
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
			const card = await drawCard(1)
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

		const dealerTotal = checkHandValue(dealerCards, false)
		const isBlackJack = checkBJ()
		const hiddenImg = hiddenCard.querySelector('img')

		if (isBlackJack === 'push') {
			if (hiddenImg) {
				hiddenImg.src = hiddenCardUrl
				dealerSum.textContent = dealerTotal.toString()
			}
			!ableToHit && isRoundOver
			alert('Push. Both have BlackJack.')
			return
		} else if (isBlackJack === 'player') {
			if (hiddenImg) {
				hiddenImg.src = hiddenCardUrl
				dealerSum.textContent = dealerTotal.toString()
			}
			!ableToHit && isRoundOver
			alert('BlackJack! Nice Win!')
			return
		} else if (isBlackJack === 'dealer') {
			if (hiddenImg) {
				hiddenImg.src = hiddenCardUrl
				dealerSum.textContent = dealerTotal.toString()
			}
			!ableToHit && isRoundOver
			alert('Dealer has BlackJack..Try again.')
			return
		}
	} catch (error) {
		console.log(error)
		alert('Error 3')
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
				const drawnCard = await drawCard(1)
				if (drawnCard) {
					dealerCards.push(drawnCard)
					loadImage(drawnCard.image, dealerCardsImage)
					dealerTotal = checkHandValue(dealerCards, isRoundOver)
					dealerSum.textContent = dealerTotal.toString()
				}
			}
			checkWin()
		}
	}
}

// Check the number value of the cards rank in total
function checkHandValue(cards) {
	let value = 0
	let numAces = 0

	cards.forEach((card) => {
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

function checkBJ() {
	let playerTotal = checkHandValue(playerCards)
	let dealerTotal = checkHandValue(dealerCards, false)

	const playerBJ = playerTotal === 21 && playerCards.length === 2
	const dealerBJ = dealerTotal === 21 && dealerCards.length === 2

	if (playerBJ && dealerBJ) {
		return 'push'
	} else if (playerBJ) {
		return 'player'
	} else if (dealerBJ) {
		return 'dealer'
	} else {
		return 'none'
	}
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
