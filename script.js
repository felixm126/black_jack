const startHand = document.querySelector('#startHand')
const hit = document.querySelector('#hit')
const stay = document.querySelector('#stay')
const doubleDown = document.querySelector('#double')
const restart = document.querySelector('#restart')
const playerSum = document.querySelector('#playerSum')
const dealerSum = document.querySelector('#dealerSum')
const hiddenCard = document.getElementById('hiddenCard')
const playerCardsImage = document.querySelector('.playerCards')
const dealerCardsImage = document.querySelector('.dealerCards')
const messageArea = document.getElementById('message')
const apiUrl = 'https://deckofcardsapi.com/api/deck/'
const newDeck = 'new/shuffle/?deck_count=6'
const minBet = 50

let startingBet = 50
let bankCounter = 1000
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
		const buttons = [
			increase,
			decrease,
			startHand,
			hit,
			doubleDown,
			stay,
			restart,
		]

		buttons.forEach((button) => {
			button.classList.toggle('buttonContainer')
		})
		toggleButton.style.display = 'none'
	})
})

async function newGame() {
	try {
		const response = await axios.get(`${apiUrl}${newDeck}`)
		deckId = response.data.deck_id
	} catch (error) {
		console.error('Error getting new deck')
	}
}

async function drawCard(cards) {
	try {
		const response = await axios.get(`${apiUrl}${deckId}/draw/?count=${cards}`)
		const card = response.data.cards[0]
		const cardsLeft = response.data.remaining

		if (cardsLeft <= 78) {
			await newGame() // Reshuffle if less than 1/4 of cards remain
		}
		return card
	} catch (error) {
		console.error('Error drawing new card')
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

		if (isBlackJack === 'push') {
			revealHiddenCard()
			dealerSum.textContent = dealerTotal.toString()

			ableToHit = false
			isRoundOver = true
			bankCounter += startingBet
			updateBetText()
			return
		} else if (isBlackJack === 'player') {
			revealHiddenCard()
			dealerSum.textContent = dealerTotal.toString()
			ableToHit = false
			isRoundOver = true
			bankCounter += startingBet * 2.5
			alert(`BLACKJACK! Nice hand!`)
			return
		} else if (isBlackJack === 'dealer') {
			revealHiddenCard()
			dealerSum.textContent = dealerTotal.toString()

			ableToHit = false
			isRoundOver = true
			return
		} else {
			console.log('Continue')
		}
	} catch (error) {
		console.error('Error dealing new hand')
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
	try {
		if (!ableToHit || isRoundOver) {
			// Reveal the hidden second dealer card
			revealHiddenCard()
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
	} catch (error) {
		console.log('error during dealers turn', error)
	}
}

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
		return 'no'
	}
}

function checkWin() {
	const playerTotal = checkHandValue(playerCards)
	const dealerTotal = checkHandValue(dealerCards, false)

	if (playerTotal > 21 && dealerTotal <= 21) {
		messageArea.textContent = 'Busted! Try again!'
	} else if (dealerTotal > 21 && playerTotal <= 21) {
		bankCounter += startingBet * 2
		messageArea.textContent = 'Dealer breaks. Nice win!'
	} else if (playerTotal == dealerTotal) {
		bankCounter += startingBet
		messageArea.textContent = 'How unlucky..Push'
	} else if (playerTotal > dealerTotal && playerTotal <= 21) {
		bankCounter += startingBet * 2
		document.getElementById('playerCards').classList.add('playerWinsAnimation')
		messageArea.textContent = 'Winner Winner Chicken Dinner'
	} else {
		messageArea.textContent = 'Dealer wins!'
		document
			.getElementById('playerCards')
			.classList.remove('playerWinsAnimation')
	}
	isRoundOver = true
	updateBetText()
}

function revealHiddenCard() {
	const hiddenImg = hiddenCard.querySelector('img')
	if (hiddenImg) {
		hiddenImg.src = hiddenCardUrl
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

function updateBetText() {
	const displayBet = document.querySelector('#betAmount')
	const displayBank = document.querySelector('#bankRoll')
	displayBet.textContent = `Current Bet: ${startingBet}`
	displayBank.textContent = `Bankroll: ${bankCounter}`
}

function restartGame() {
	playerCards = []
	dealerCards = []
	ableToHit = true
	isRoundOver = false
	bankCounter = 1000
	startingBet = 50
	hiddenCard.innerHTML = ''
	playerCardsImage.innerHTML = ''
	dealerCardsImage.innerHTML = ''
	messageArea.innerHTML = 'Ready to play?'
	updateBetText()
	updateHandTotal()
	newGame()
}

increase.addEventListener('click', function () {
	if (!ableToHit || isRoundOver) {
		if (bankCounter >= startingBet + minBet) {
			startingBet += minBet
			updateBetText()
		} else {
			return
		}
	} else {
		return
	}
})

decrease.addEventListener('click', function () {
	if (!ableToHit || isRoundOver) {
		if (startingBet - minBet >= minBet) {
			startingBet -= minBet
			updateBetText()
		} else {
			return
		}
	} else {
		return
	}
})

startHand.addEventListener('click', function () {
	playerCards = []
	dealerCards = []
	ableToHit = true
	isRoundOver = false
	hiddenCard.innerHTML = ''
	playerCardsImage.innerHTML = ''
	dealerCardsImage.innerHTML = ''
	messageArea.textContent = ''
	updateBetText()
	updateHandTotal()

	if (bankCounter >= startingBet) {
		bankCounter -= startingBet
		updateBetText()
	} else {
		alert('Not enough funds for the hand.')
		ableToHit = false
		isRoundOver = true
		dealerSum.textContent = ''
		return
	}
	dealNewHand()
})

hit.addEventListener('click', async () => {
	const isBlackJack = checkBJ()
	if (isBlackJack === 'no' && !isRoundOver) {
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
		}
	}
})

doubleDown.addEventListener('click', async () => {
	// Check to see if Player is allowed to double
	if (isRoundOver || !ableToHit) {
		return
	} else if (playerCards.length > 2) {
		return
	}
	startingBet *= 2
	updateBetText()
	bankCounter -= startingBet
	updateBetText()
	const drawnCard = await drawCard(1)
	if (drawnCard) {
		playerCards.push(drawnCard)
		loadImage(drawnCard.image, playerCardsImage)
		updateHandTotal()
	}
	ableToHit = false
	isRoundOver = true
	dealersTurn()
})

stay.addEventListener('click', () => {
	const isBlackJack = checkBJ()
	if (isBlackJack === 'no' && !isRoundOver) {
		ableToHit = false
		isRoundOver = true
		dealersTurn()
	}
})

restart.addEventListener('click', restartGame)

updateBetText()
newGame()
