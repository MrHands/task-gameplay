import './App.css';

import CardsDatabase from './data/CardsDatabase.json';
import DecksDatabase from './data/DecksDatabase.json';

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Character from './components/Character';
import Card from './components/Card';
import ShiftHud from './components/ShiftHud';

function randomPercentage() {
	return Math.floor(Math.random() * 100);
}

export default class App extends React.Component {
	constructor() {
		super();

		this.state = {
			shift: 0,
			deck: 'balanced',
			deckCards: [],
			handCards: [],
			characters: [
				{
					id: 0,
					name: 'Chichi',
					stats: {
						stamina: 5,
						pleasure: randomPercentage(),
						passionate: 0,
						intimate: 0,
						dominant: 0
					}
				},
				{
					id: 1,
					name: 'Riya',
					stats: {
						stamina: 5,
						pleasure: randomPercentage(),
						passionate: 0,
						intimate: 0,
						dominant: 0
					}
				},
				{
					id: 2,
					name: 'Bobby',
					stats: {
						stamina: 5,
						pleasure: randomPercentage(),
						passionate: 0,
						intimate: 0,
						dominant: 0
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
			characters,
			handCards
		} = this.state;

		handCards.length = 0;

		for (let i = 0; i < characters.length + 1; ++i) {
			const card = deckCards.pop();
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
			if (effect.type !== 'pleasure' && newValue >= 100) {
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
			const taskPreviousCharacter = state.characters.find(character => character.card === dropped);

			const newHand = state.handCards.filter(card => card.handId !== dropped.handId);
			newHand.sort((left, right) => {
				return left.handId < right.handId ? -1 : 1;
			});

			const updatedCharacters = state.characters.map(character => {
				// clear card from previous owner

				if (character.id === taskPreviousCharacter?.id) {
					character.card = null;
				}

				// assign card to owner

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
			const {
				characters,
				shift,
			} = state;

			const newCharacters = characters.map(character => {
				if (!character.card) {
					character.card = {
						effects: [
							{
								type: 'stamina',
								value: 50,
							},
							{
								type: 'pleasure',
								value: -10,
							}
						]
					}
				}

				character.card.effects.forEach(effect => {
					const stat = character.stats[effect.type];
					character.stats[effect.type] = Math.max(0, Math.min(stat + effect.value, 100));
				});

				character.card = null;

				return character;
			});

			return {
				characters: newCharacters,
				shift: shift + 1,
			}
		});

		// draw new hand

		this.drawHand(this.state.deckCards);
	}

	render() {
		const {
			handCards,
			characters,
			shift,
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
				<ShiftHud
					shift={shift}
					characters={characters}
					handleStartShift={this.handleStartShift} />
				<h3 className="a-explain">Click and drag tasks from your hand to a character slot</h3>
				<div className="o-cardsList">
					{ handCards.map((card, index) => {
						return <Card key={`card-${index}`} card={card} />;
					})}
				</div>
			</DndProvider>
		);
	}
};
