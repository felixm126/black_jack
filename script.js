const start = document.querySelector('#start')
const increase = document.querySelector('#increase')
const decrease = document.querySelector('#decrease')
const hit = document.querySelector('#hit')
const stay = document.querySelector('#stay')
const double = document.querySelector('#double')
const restart = document.querySelector('#restart')

const displayPlayerCard = document.querySelector('#playerCards')
const displayDealerCard = document.querySelector('#dealerCards')

const apiUrl = 'https://deckofcardsapi.com/api/deck/'
const getDeckId = 'new/shuffle/?deck_count=6'

let deckId = ''
let playerCards = []
let dealerCards = []

function startGame() {
	start.addEventListener('click', async () => {
		try {
			const response = await axios.get(`${apiUrl}${getDeckId}`)
			deckId = response.data.deck_id
		} catch (error) {
			console.log(error)
		}
	})
}

async function drawCard(numCards) {
	startGame()
	try {
		const response = await axios.get(
			`${apiUrl}${deckId}/draw/?count=${numCards}`
		)
		let cardValue = response.data.cards.value
		console.log(cardValue)

		let cardSuit = response.data.cards.suit
		console.log(cardSuit)

		let cardImage = response.data.cards.image
		console.log(cardImage)
	} catch (error) {
		console.log(error)
	}
}

async function dealNewHand() {
	try {
		for (let i = 1; i < 5; i++) {
			let cards = await drawCard(1)
			if (cards.length > 0) {
				if (i % 2 !== 0) {
					playerCards.push(cards[0])
				} else {
					dealerCards.push(cards[0])
				}
			} else {
				console.log('No card Drawn')
			}
		}
	} catch (error) {
		console.log(error)
	}
}

// startGame()
