import './App.css';

import CardsDatabase from './data/CardsDatabase.json';

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
			deck: [...CardsDatabase.cards],
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

	getCharacter(owner) {
		return this.state.characters.find(character => {
			return character.id === owner;
		});
	}

	canBePlayed(owner, card) {
		const character = this.getCharacter(owner);
		if (!character) {
			return false;
		}

		let allowed = true;

		card.effects.forEach(effect => {
			const newValue = character.stats[effect.type] + effect.value;
			if (newValue < 0 || newValue >= 10) {
				allowed = false;
			}
		});

		return allowed;
	}

	setCharacterTask(owner, dropped) {
		this.setState(state => {
			const updatedDeck = state.deck.filter(card => card !== dropped);

			const updatedCharacters = state.characters.map(character => {
				if (character.id === owner) {
					character.card = dropped;
				}
				return character;
			});

			return {
				deck: updatedDeck,
				characters: updatedCharacters
			}
		});
	}

	clearCharacterTask(owner) {
		this.setState(state => {
			let card = null;

			const updatedCharacters = state.characters.map(character => {
				if (character.id === owner) {
					card = Object.assign({}, character.card);
					character.card = null;
				}
				return character;
			});

			const updatedDeck = [...state.deck];
			if (card) {
				updatedDeck.push(card);
			}

			return {
				deck: updatedDeck,
				characters: updatedCharacters
			}
		});
	}

	startShift() {
		this.setState(state => {
			const updatedCharacters = state.characters.map(character => {
				if (character.card) {
					character.card.effects.forEach(effect => {
						character.stats[effect.type] += effect.value;
					});
					character.card = null;
				}

				return character;
			});

			return {
				characters: updatedCharacters
			}
		});
	}

	render() {
		const {
			deck,
			characters
		} = this.state;

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
					{ deck.map(card => {
						return <Card key={`card-${card.id}`} card={card} />;
					})}
				</div>
			</DndProvider>
		);
	}
};
