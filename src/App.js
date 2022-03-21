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
import { TaskOutcome } from './enums/TaskOutcome';

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
		this.handleTaskStart = this.startTask.bind(this);
		this.handleFinishShift = this.finishShift.bind(this);
		this.handleStaminaChange = this.staminaChange.bind(this);
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
		this.setUpCharacters();
		this.drawHand();
	}

	setUpCharacters() {
		this.setState(state => {
			const {
				characters,
			} = state;

			const newCharacters = characters.map(character => {
				if (character.task) {
					character.task.effects.forEach(effect => {
						const statValue = character.stats[effect.type];
						character.stats[effect.type] = this.clampCharacterStat(effect.type, statValue + effect.value);
					});
					character.task = '';
				}

				character.staminaCost = 1;

				return character;
			});

			return {
				charactersUnplaced: newCharacters,
			}
		});
	}

	drawHand() {
		this.setState(state => {
			const {
				characters,
				tasksDeck,
				restDeck
			} = state;
	
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
				task.characterId = null;
				task.roll = -1;
				task.outcome = '';
			});

			return {
				handCards: this.shuffleCards(handCards)
			}
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

	getCharacter(id) {
		return this.state.characters.find(character => {
			return character.id === id;
		}) || null;
	}

	clampCharacterStat(type, value) {
		let maxValue = Infinity;

		switch (type) {
			case 'stamina': {
				maxValue = 5;
				break;
			}
			case 'pleasure': {
				maxValue = 100;
				break;
			}
			default: {
				break;
			}
		}

		return Math.max(0, Math.min(value, maxValue));
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
			character.task = task;

			task.characterId = character.id;

			return {
				charactersUnplaced: state.characters.filter(character => character.task === '')
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

	startTask(handId) {
		console.log(`startTask ${handId}`);

		// prevent react weirdness where it recalculates after setting the value??
		const roll = Math.floor(Math.random() * 20);

		this.setState(state => {
			const task = state.handCards.find(task => task.handId === handId);

			// determine outcome based on difficulty and roll

			if (task.difficulty > 0) {
				task.roll = roll;
				if (task.roll === 19) {
					task.outcome = TaskOutcome.CRITICAL_SUCCESS;
				} else if (task.roll >= task.difficulty) {
					task.outcome = TaskOutcome.SUCCESS;
				} else {
					task.outcome = TaskOutcome.FAIL;
				}
			} else {
				task.roll = 0;
				task.outcome = TaskOutcome.SUCCESS;
			}

			// apply outcome to effects

			switch (task.outcome) {
				case TaskOutcome.FAIL: {
					task.effects.forEach(effect => {
						switch (effect.type) {
							case 'stamina':
								break;
							case 'pleasure': {
								if (effect.value < 0) {
									effect.value *= 2;
								} else {
									effect.value /= 2;
								}
								break;
							}
							default:
								effect.value /= 2;
								break;
						}
						effect.value = Math.floor(effect.value);
					});
					break;
				}
				case TaskOutcome.CRITICAL_SUCCESS: {
					task.effects.forEach(effect => {
						switch (effect.type) {
							case 'stamina':
								break;
							case 'pleasure': {
								if (effect.value < 0) {
									effect.value /= 2;
								} else {
									effect.value *= 2;
								}
								break;
							}
							default:
								effect.value *= 2;
								break;
						}
						effect.value = Math.floor(effect.value);
					});
					break;
				}
				default: break;
			}

			console.log(`task ${task.handId}: roll ${task.roll} outcome ${task.outcome}`);

			return {
				handCards: state.handCards
			}
		});
	}

	finishShift() {
		// update shift

		this.setState(state => {
			const {
				shift,
			} = state;

			return {
				shift: shift + 1,
			}
		});

		// update characters

		this.setUpCharacters();

		// draw new hand

		this.drawHand();
	}

	staminaChange(character, amount) {
		this.setState(state => {
			const {
				characters,
			} = state;

			return {
				characters: characters.map(it => {
					if (it.id === character.id) {
						const staminaCost = Math.max(1, Math.min(it.staminaCost + amount, it.stats.stamina));
						console.log(`character ${character.id} amount ${amount} staminaCost ${staminaCost}`);
						console.log(character.task.characterId);
						return Object.assign({}, it, {staminaCost});
					} else {
						return it;
					}
				}),
			}
		});
	}

	render() {
		const {
			handCards,
			characters,
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
				<ShiftHud
					className="o-app__hud"
					shift={shift}
					characters={characters}
					handleFinishShift={this.handleFinishShift} />
				<div className="m-tasksList o-app__tasks">
					{ handCards.map((task, index) => {
						return <Task
							key={`task-${index}`}
							task={task}
							character={this.getCharacter(task.characterId)}
							clampCharacterStat={this.clampCharacterStat}
							canBePlaced={this.handleCanBePlaced}
							onCharacterDropped={this.handleSetCharacterTask}
							onStaminaChange={this.handleStaminaChange}
							onTaskStart={this.handleTaskStart} />;
					})}
				</div>
				<div className="o-characterList o-app__characters">
					{ charactersUnplaced.map(character => {
						return <Character
							key={`character-${character.id}`}
							clampCharacterStat={this.clampCharacterStat}
							onTaskCleared={this.handleClearCharacterTask}
							canBePlaced={this.handleCanBePlaced}
							{...character} />;
					}) }
				</div>
			</DndProvider>
		);
	}
};
