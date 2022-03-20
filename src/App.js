import './App.css';

import CardsDatabase from './data/CardsDatabase.json';
import DecksDatabase from './data/DecksDatabase.json';
import TasksDatabase from './data/TasksDatabase.json';

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Character from './components/Character';
import ShiftHud from './components/ShiftHud';
import Task from './components/Task';

function randomPercentage() {
	return Math.floor(Math.random() * 100);
}

export default class App extends React.Component {
	constructor() {
		super();

		this.state = {
			shift: 0,
			deck: 'balanced',
			handCards: [],

			tasksDeck: [],
			restDeck: [],

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
					},
					task: ''
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
					},
					task: ''
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
					},
					task: ''
				}
			],

			charactersUnplaced: []
		};

		this.handleCanBePlaced = this.canBePlaced.bind(this);
		this.handleSetCharacterTask = this.setCharacterTask.bind(this);
		this.handleClearCharacterTask = this.clearCharacterTask.bind(this);
		this.handleStartShift = this.startShift.bind(this);
	}

	componentDidMount() {
		// build deck

		const deckTasks = DecksDatabase.decks.find(deck => {
			return deck.id === this.state.deck;
		});
		console.log(deckTasks);

		const tasksDeck = this.shuffleCards(deckTasks.tasks.map(id => {
			return Object.assign({}, this.getTask(id));
		}));
		console.log(tasksDeck);

		const deckRest = DecksDatabase.decks.find(deck => {
			return deck.id === 'rest';
		});

		const restDeck = this.shuffleCards(deckRest.tasks.map(id => {
			return Object.assign({}, this.getTask(id));
		}));

		this.setState({
			tasksDeck,
			restDeck
		});
	}

	startGame() {
		const {
			characters
		} = this.state;

		this.setState({
			charactersUnplaced: characters
		});


		// draw hand

		this.drawHand();
	}

	drawHand() {
		const {
			characters,
			tasksDeck,
			restDeck
		} = this.state;

		const handCards = [];

		for (let i = 0; i < characters.length; ++i) {
			const task = tasksDeck.pop();
			task.handId = handCards.length;
			handCards.push(task);
		}

		for (let i = 0; i < Math.max(1, characters.length - 1); ++i) {
			const task = Object.assign({}, restDeck[0]);
			task.handId = handCards.length;
			handCards.push(task);
		}

		handCards.forEach(task => {
			task.character = null;
		});

		this.setState({
			handCards: this.shuffleCards(handCards)
		});
	}

	getCard(id) {
		return CardsDatabase.cards.find(card => {
			return card.id === id;
		});
	}

	getTask(id) {
		return TasksDatabase.tasks.find(task => {
			return task.id === id;
		});
	}

	getCharacter(owner) {
		return this.state.characters.find(character => {
			return character.id === owner;
		});
	}

	shuffleCards(cards) {
		const copy = [];

		for (let n = cards.length; n > 0; n--) {
			let i = Math.floor(Math.random() * n);
			copy.push(cards.splice(i, 1)[0]);
		}

		return copy;
	}

	canBePlaced(id) {
		return true;
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

	setCharacterTask(task, dropped) {
		this.setState(state => {
			const character = state.characters.find(character => character.id === dropped);
			character.task = task.id;

			task.character = character;

			/* const newHand = state.handCards.filter(card => card.handId !== dropped.handId);
			newHand.sort((left, right) => {
				return left.handId < right.handId ? -1 : 1;
			});

			const updatedCharacters = state.characters.map(character => {
				// clear card from previous owner

				if (character.id === character?.id) {
					character.card = null;
				}

				// assign card to owner

				if (character.id === owner) {
					character.card = dropped;
				}

				return character;
			}); */

			const charactersUnplaced = state.characters.filter(character => character.task === '');

			return {
				charactersUnplaced
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

		this.drawHand();
	}

	render() {
		const {
			handCards,
			charactersUnplaced,
			shift,
		} = this.state;

		if (handCards.length === 0) {
			return (
				<button onClick={this.startGame.bind(this)}>Start Game</button>
			);
		}

		return (
			<DndProvider backend={HTML5Backend}>
				<div className="m-tasksList o-app__tasks">
					{ handCards.map((task, index) => {
						return <Task
							key={`task-${index}`}
							task={task}
							canBePlaced={this.handleCanBePlaced}
							onCharacterDropped={this.handleSetCharacterTask} />;
					})}
				</div>
				<div className="o-characterList o-app__characters">
					{ charactersUnplaced.map(character => {
						return <Character
							key={`character-${character.id}`}
							onTaskCleared={this.handleClearCharacterTask}
							canBePlaced={this.handleCanBePlaced}
							{...character} />;
					}) }
				</div>
				<ShiftHud
					className="o-app__hud"
					shift={shift}
					characters={charactersUnplaced}
					handleStartShift={this.handleStartShift} />
				<h3 className="a-explain">Click and drag tasks from your hand to a character slot</h3>
			</DndProvider>
		);
	}
};
