import './App.css';

import CardsDatabase from './data/CardsDatabase.json';
import DecksDatabase from './data/DecksDatabase.json';

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Character from './components/Character';
import Card from './components/Card';

function randomPercentage() {
	return Math.floor(Math.random() * 10);
}

export default class App extends React.Component {
	constructor() {
		super();

		this.state = {
			deck: 'balanced',
			deckCards: [],
			handCards: [],
			characters: [
				{
					id: 0,
					name: 'Chichi',
					stats: {
						hunger: randomPercentage(),
						stress: randomPercentage(),
						horny: randomPercentage(),
					}
				},
				{
					id: 1,
					name: 'Riya',
					stats: {
						hunger: randomPercentage(),
						stress: randomPercentage(),
						horny: randomPercentage(),
					}
				},
				{
					id: 2,
					name: 'Bobby',
					stats: {
						hunger: randomPercentage(),
						stress: randomPercentage(),
						horny: randomPercentage(),
					}
				}
			]
		};

		this.handleCanBePlayed = this.canBePlayed.bind(this);
		this.handleSetCharacterTask = this.setCharacterTask.bind(this);
		this.handleClearCharacterTask = this.clearCharacterTask.bind(this);
		this.handleStartShift = this.startShift.bind(this);
	}

	startGame() {
		// build deck

		const deck = DecksDatabase.decks.find(deck => {
			return deck.id === this.state.deck;
		});

		let deckCards = this.shuffleCards(deck.cards.map(id => {
			return Object.assign({}, this.getCard(id));
		}));

		this.setState({
			deckCards: deckCards
		});

		// draw hand

		this.drawHand(deckCards);
	}

	drawHand(deckCards) {
		let {
			handCards
		} = this.state;

		let deckMaintenanceCards = deckCards.filter(card => {
			return card.id.startsWith('maintenance');
		});
		let deckOtherCards = deckCards.filter(card => {
			return !card.id.startsWith('maintenance');
		});

		let handMaintenanceCards = handCards.filter(card => {
			return card.id.startsWith('maintenance');
		});

		for (let i = handMaintenanceCards.length; i < 3; ++i) {
			const card = deckMaintenanceCards.pop();
			card.handId = handCards.length;
			handCards.push(card);
		}

		for (let i = handCards.length; i < (3 * 3) + 3; ++i) {
			const card = deckOtherCards.pop();
			card.handId = handCards.length;
			handCards.push(card);
		}

		this.setState({
			handCards: handCards
		});
	}

	getCard(id) {
		return CardsDatabase.cards.find(card => {
			return card.id === id;
		});
	}

	getCharacter(owner) {
		return this.state.characters.find(character => {
			return character.id === owner;
		});
	}

	shuffleCards(cards) {
		let copy = [];

		for (let n = cards.length; n > 0; n--) {
			let i = Math.floor(Math.random() * n);
			copy.push(cards.splice(i, 1)[0]);
		}

		return copy;
	}

	canBePlayed(owner, card) {
		const character = this.getCharacter(owner);
		if (!character) {
			return false;
		}

		let allowed = true;

		card.effects.forEach(effect => {
			const newValue = character.stats[effect.type] + effect.value;
			if (effect.type !== 'horny' && newValue >= 10) {
				allowed = false;
			}
		});

		return allowed;
	}

	setCharacterTask(owner, dropped) {
		if (!this.canBePlayed(owner, dropped)) {
			return;
		}

		this.setState(state => {
			const newHand = state.handCards.filter(card => card.handId !== dropped.handId);
			newHand.sort((left, right) => {
				return left.handId < right.handId ? -1 : 1;
			});

			const updatedCharacters = state.characters.map(character => {
				if (character.id === owner) {
					character.card = dropped;
				}
				return character;
			});

			return {
				handCards: newHand,
				characters: updatedCharacters
			}
		});
	}

	clearCharacterTask(owner) {
		this.setState(state => {
			let card = null;

			const newCharacters = state.characters.map(character => {
				if (character.id === owner) {
					card = Object.assign({}, character.card);
					character.card = null;
				}
				return character;
			});

			const newHand = [...state.handCards];
			if (card) {
				newHand.push(card);
			}
			newHand.sort((left, right) => {
				return left.handId < right.handId ? -1 : 1;
			});

			return {
				handCards: newHand,
				characters: newCharacters
			}
		});
	}

	startShift() {
		this.setState(state => {
			const newCharacters = state.characters.map(character => {
				if (character.card) {
					character.card.effects.forEach(effect => {
						const stat = character.stats[effect.type];
						character.stats[effect.type] = Math.max(0, Math.min(stat + effect.value, 9));
					});
					character.card = null;
				}

				return character;
			});

			return {
				characters: newCharacters
			}
		});
	}

	render() {
		const {
			handCards,
			characters
		} = this.state;

		if (handCards.length === 0) {
			return (
				<button onClick={this.startGame.bind(this)}>Start Game</button>
			);
		}

		return (
			<DndProvider backend={HTML5Backend}>
				<div className="o-characterList">
					{ characters.map(character => {
						return <Character
							key={`character-${character.id}`}
							onTaskDropped={this.handleSetCharacterTask}
							onTaskCleared={this.handleClearCharacterTask}
							canBePlayed={this.handleCanBePlayed}
							{...character} />;
					}) }
				</div>
				<button onClick={this.handleStartShift}>
					Start Shift
				</button>
				<div className="o-cardsList">
					{ handCards.map((card, index) => {
						return <Card key={`card-${index}`} card={card} />;
					})}
				</div>
			</DndProvider>
		);
	}
};
