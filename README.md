## **Blackjack**

## Installation and Setup

- Fork and clone this repository into your IDE.

## Technologies Used

- HTML/CSS
- JavaScript,
- RESTful API
- Axios
- Surge

## Project Description

A simple interactive Black Jack game using HTML, CSS, and vanilla JavaScript, utilizing **Deck of Cards** RESTful API for generating the deck and backend handling of the cards.

The user will be able to play against a virtual dealer where both the dealer and user will have randomly generated cards based on the standard 52 card deck using 6 decks. The user will start with a set amount of money and be able to place bets for each session.

## Game Features

Upon launching the application, players are greeted by the home screen where they will have the option to either start or familiarize themselves with the rules of the game.

Players will start with a bankroll of $1000. They can select and confirm their bet amount to initiate the session.

Players are prompted with options to `Hit`, `Stand`, `Double`, or `Split`

- The split feature will only work with two of the same face value cards

If the player's hand total exceeds 21, they will lose the round and their bet.

A notification will appear indicating Win or Loss of their bet from their bankroll.

An option to restart the game is offered if players bankroll reaches 0.

High scores will be tallied and shown with the restart game feature.

## How to play

# Starting the game

1. Launch the game and you will be brought to the home screen.

2. Choose to either start the game immediately or review the rules for Blackjack.

# Gameplay

1. Once the game has started, you will be prompted to place your bet. Confirm the amount you would like to bet.

2. After you select confirm, you will be dealt two cards faceup and the dealer will also be dealt two cards with one facedown.

3. Player's turn:

- You can choose to `Hit` or `Stand`.
- Additionally if you like your hand, you are able to `Double` but you will not be able to hit again.
- If the first two cards you are dealt are pairs, you have the option of `Split`.
  - Doing so will require an additional bet equal to your original bet amount.

4. Dealer's Turn:

- After you stand, the dealer reveals their hidden card and continues to hit until either they bust or will stand on 17 or higher.

## How to Win

The goal of the game is to have a higher total hand value than the dealer. You can do this by: 1. Have a higher value than the dealer without busting. 2. Stand on your hand that has a value under 21 with the dealer busting. 3. **Blackjack!** - Have a hand value equal to 21 from the first two cards dealt to you. - In the instance the dealer also 21, you push.

### Key Blackjack Terminology

Hit: Deal me another card.
Stand: No more cards, keep your hand.
Double: Doubling your bet for only one more card.
Split: Double your bet, split your pair into two separate hands, and continue with the round.

Pairs: Two cards with the same face value ie. 2 Aces
Push: Same valued hands as the dealer. You neither win nor lose your bet.
Bust: Total hand value is over 21.
Bankroll: How much money you have to play.

## Future Enhancements

## Credits

This project uses resources from the following websites:

- [Deck of Cards API](https://deckofcardsapi.com/) functionalities:
  Creating a new shuffled deck
  Drawing a card
