## **Blackjack**

## Installation and Setup

- Fork and clone this repository into your IDE.
- Node.js installed with npm.

## Technologies Used

- HTML/CSS
- JavaScript
- RESTful API
- Axios
- Deployed with Surge

## Project Description

A simple interactive Black Jack game using HTML, CSS, and vanilla JavaScript, utilizing **Deck of Cards** RESTful API for generating the deck and backend handling of the cards.

The user will be able to play against a virtual dealer where both the dealer and user will have randomly generated cards based on the standard 52 card deck using 6 decks. The user will start with a set amount of money and be able to place bets for each round.

## Game Features

Upon launching the application, players are greeted by the home screen where they will have the option to either start or familiarize themselves with the rules of the game.

Players will start with a bankroll of $1000. They can select bet amount and click Start Hand to initiate the session.

Players are prompted with options to `Hit`, `Stand`, `Double`, as well as buttons to `Increase` or `Decrease` bet sizes in increments of $50.

If the player's hand total exceeds 21, they will lose the round and their bet.

A notification will appear indicating Win or Loss of their bet from their bankroll.

An option to restart the game is offered if player's bankroll is less than $150.

## How to play

# Starting the game

1. Launch the game and you will be brought to the home screen.

2. Choose to either start the game immediately or review the rules for Blackjack.

# Gameplay

1. Once the game has started, you will be prompted to select your bet then click Start Hand to start the round.

2. After you click start hand, you will be dealt two cards faceup and the dealer will also be dealt two cards with one facedown.

3. Player's turn:

- You can choose to `Hit` or `Stand`.
- Additionally if you like your hand, you are able to `Double` but you will not be able to hit again and you double your original bet.

4. Dealer's Turn:

- After you stand, the dealer reveals their hidden card and will hit until either they reach a 17 or bust.

## How to Win

The goal of the game is to have a higher total hand value than the dealer. You can do this by:

1. Having a higher value than the dealer without busting.
2. Stand on your hand that has a value under 21 with the dealer going over 21.
3. **Blackjack!** - Have a hand value equal to 21 from the first two cards dealt to you. - In the instance the dealer also 21, you push.

## Key Blackjack Terminology and Values

Card Numbers 2-10: Face value equivalent to its number.
Face Cards Jack(J) Queen(Q) King(K): Face value equivalent to 10 in Blackjack.
Ace: Face value either 1 or 11.

Hit: Deal me another card.
Stand: No more cards, keep your hand.
Double: Doubling your bet for only one more card.

Hard Number: A hand not containing an Ace with its face value being fixed.
ie. 5 + 10 = 15
Soft Number: A hand containing an Ace where the Ace can have a value of either 1 or 11.
ie. A + 5 = 6 or 16
Pairs: Two cards with the same face value ie. 2 Aces
Push: Same valued hands as the dealer. You neither win nor lose your bet.
Bust: Total hand value is over 21.
Bankroll: How much money you have to play.

## Post-MVP Enhancements

- Add dark mode feature
- Local storage for High Scores
- Have side-bet feature
  Match the Dealer: Having the same card as the dealer pays a separate amount

## Credits

This project uses resources from the following websites:

[Deck of Cards API](https://deckofcardsapi.com/) functionalities:

- Creating 6 new shuffled decks.
- Drawing a card.
- Getting the information of the card including: Value, Suit, Picture of the card.
