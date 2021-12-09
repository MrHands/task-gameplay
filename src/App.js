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

	setCharacterTask(owner, card) {
		console.log(owner);
		console.log(card);
	}

	render() {
		const {
			characters
		} = this.state;

		return (
			<DndProvider backend={HTML5Backend}>
				<div className="o-cardsList">
					{ CardsDatabase.cards.map(card => {
						return <Card key={`card-${card.id}`} card={card} />;
					})}
				</div>
				<div className="o-characterList">
					{ characters.map(character => {
						return <Character
							key={`character-${character.id}`}
							onTaskDropped={this.setCharacterTask.bind(this)}
							{...character} />;
					}) }
				</div>
			</DndProvider>
		);
	}
};
