import './App.css';

import CardsDatabase from './data/CardsDatabase.json';
import React from 'react';

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

	render() {
		const {
			characters
		} = this.state;

		return (
			<React.Fragment>
				<div className="o-cardsList">
					{ CardsDatabase.cards.map(card => {
						return <Card key={`card-${card.id}`} card={card} />;
					})}
				</div>
				<div className="o-characterList">
					{ characters.map(character => {
						return <Character key={`character-${character.id}`} name={character.name} stats={character.stats} />;
					}) }
				</div>
			</React.Fragment>
		);
	}
};
