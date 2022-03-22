import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import CardsDatabase from './data/CardsDatabase.json';
import DecksDatabase from './data/DecksDatabase.json';
import TasksDatabase from './data/TasksDatabase.json';
import { TaskOutcome } from './enums/TaskOutcome';
import GameStart from './states/GameStart';
import DayShift from './states/DayShift';

import './App.css';

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
					staminaCost: 0,
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
					staminaCost: 0,
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
					staminaCost: 0,
					task: ''
				}
			],
		};

		this.handleCanBePlaced = this.canBePlaced.bind(this);
		this.handleSetCharacterTask = this.setCharacterTask.bind(this);
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
			return JSON.parse(JSON.stringify(this.getTask(id)));
		}));
		console.log(tasksDeck);

		const deckRest = DecksDatabase.decks.find(deck => {
			return deck.id === 'rest';
		});

		const restDeck = this.shuffleCards(deckRest.tasks.map(id => {
			return JSON.parse(JSON.stringify(this.getTask(id)));
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

			return {
				characters: characters.map(character => {
					const clone = {...character};

					// apply task effects
	
					if (clone.task) {
						clone.task.effects.forEach(effect => {
							const statValue = clone.stats[effect.type];
							clone.stats[effect.type] = this.clampCharacterStat(effect.type, statValue + effect.value);
						});
						clone.task = '';
					}
	
					// modify stamina
	
					clone.stats.stamina = this.clampCharacterStat('stamina', clone.stats.stamina - clone.staminaCost);
					clone.staminaCost = 1;
	
					return clone;
				}),
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

			// deep copy to avoid copying effects array as references!
	
			for (let i = 0; i < characters.length; ++i) {
				const task = JSON.parse(JSON.stringify(tasksDeck.pop()));
				task.handId = handCards.length;
				handCards.push(task);
			}
			console.log(tasksDeck);
	
			for (let i = 0; i < Math.max(1, characters.length - 1); ++i) {
				const task = JSON.parse(JSON.stringify(restDeck[0]));
				task.handId = handCards.length;
				handCards.push(task);
			}
	
			handCards.forEach(task => {
				task.characterId = null;
				task.roll = -1;
				task.outcome = '';
			});

			return {
				handCards: this.shuffleCards(handCards),
				tasksDeck
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

	setCharacterTask(task, dropped) {
		this.setState(state => {
			return {
				characters: state.characters.map(character => {
					if (character.id !== dropped) {
						return character;
					}

					const clone = {...character};

					clone.task = task;
					task.characterId = clone.id;

					if (task.difficulty === 0) {
						clone.staminaCost = 0;
					} else {
						clone.staminaCost = 1;
					}

					return clone;
				})
			}
		});
	}

	startTask(handId) {
		console.log(`startTask ${handId}`);

		this.setState(state => {
			return {
				handCards: state.handCards.map(task => {
					if (task.handId !== handId) {
						return task;
					}

					const clone = {...task};

					const character = this.getCharacter(clone.characterId);
					const bonus = character.staminaCost - 1;

					// determine outcome based on difficulty and roll

					if (clone.difficulty > 0) {
						clone.roll = Math.floor(Math.random() * 20);
						if (clone.roll === 19) {
							clone.outcome = TaskOutcome.CRITICAL_SUCCESS;
						} else if (clone.roll >= clone.difficulty - bonus) {
							clone.outcome = TaskOutcome.SUCCESS;
						} else {
							clone.outcome = TaskOutcome.FAIL;
						}
					} else {
						clone.roll = 0;
						clone.outcome = TaskOutcome.SUCCESS;
					}

					// apply outcome to effects

					switch (clone.outcome) {
						case TaskOutcome.FAIL: {
							clone.effects.forEach(effect => {
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
							clone.effects.forEach(effect => {
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

					// add stamina to effects

					if (clone.difficulty > 0) {
						let staminaEffect = clone.effects.find(effect => effect.type === 'stamina');
						if (staminaEffect) {
							staminaEffect.value = -character.staminaCost;
						} else {
							staminaEffect = {
								type: 'stamina',
								value: -character.staminaCost
							};
							clone.effects.push(staminaEffect);
						}
					}

					console.log(`task ${clone.handId}: roll ${clone.roll} difficulty ${clone.difficulty} bonus ${bonus} outcome ${clone.outcome}`);

					// notify character

					character.task = clone;

					return clone;
				})
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
						// return Object.assign({}, it, {staminaCost});
						return {...it, staminaCost};
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
			shift,
		} = this.state;

		const charactersUnplaced = characters.filter(character => character.task === '');

		let gameState = null;

		if (handCards.length === 0) {
			gameState = (
				<GameStart
					onStartGame={this.startGame.bind(this)}
				/>
			);
		} else {
			gameState = (
				<DayShift
					shift={shift}
					characters={characters}
					charactersUnplaced={charactersUnplaced}
					handCards={handCards}
					getCharacter={this.getCharacter.bind(this)}
					clampCharacterStat={this.clampCharacterStat.bind(this)}
					canBePlaced={this.canBePlaced.bind(this)}
					onCharacterDropped={this.setCharacterTask.bind(this)}
					onStaminaChange={this.staminaChange.bind(this)}
					onTaskStart={this.startTask.bind(this)}
					onShiftFinish={this.finishShift.bind(this)}
				/>
			);
		}

		return (
			<DndProvider backend={HTML5Backend}>
				{gameState}
			</DndProvider>
		);
	}
};
