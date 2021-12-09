import './App.css';

import CardsDatabase from './data/CardsDatabase.json';

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Character from './components/Character';
import Card from './components/Card';

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
						hunger: 0,
						stress: 0,
						horny: 0,
					}
				},
				{
					id: 1,
					name: 'Riya',
					stats: {
						hunger: 0,
						stress: 0,
						horny: 0,
					}
				},
				{
					id: 2,
					name: 'Bobby',
					stats: {
						hunger: 0,
						stress: 0,
						horny: 0,
					}
				}
			]
		};
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

	render() {
		const {
			deck,
			characters
		} = this.state;

		return (
			<DndProvider backend={HTML5Backend}>
				<div className="o-cardsList">
					{ deck.map(card => {
						return <Card key={`card-${card.id}`} card={card} />;
					})}
				</div>
				<div className="o-characterList">
					{ characters.map(character => {
						return <Character
							key={`character-${character.id}`}
							onTaskDropped={this.setCharacterTask.bind(this)}
							onTaskCleared={this.clearCharacterTask.bind(this)}
							{...character} />;
					}) }
				</div>
			</DndProvider>
		);
	}
};
