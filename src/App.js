import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import ShiftHud from './components/ShiftHud';
import TasksDatabase from './data/TasksDatabase.json';
import DecksDatabase from './data/DecksDatabase.json';
import SexMovesDatabase from './data/SexMovesDatabase.json';
import { Shift } from './enums/Shift';
import { TaskOutcome } from './enums/TaskOutcome';
import DayShift from './states/DayShift';
import GameStart from './states/GameStart';
import NightShift from './states/NightShift';

import './App.scss';

Math.clamp = (value, min, max) => {
	return Math.max(min, Math.min(value, max));
}

function randomPercentage() {
	return Math.floor(Math.random() * 100);
}

export default class App extends React.Component {
	constructor() {
		super();

		this.state = {
			day: 1,
			shift: Shift.MORNING,
			sexergy: 0,

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
						pleasure: 0,
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
						pleasure: 0,
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
						pleasure: 0,
						passionate: 0,
						intimate: 0,
						dominant: 0
					},
					staminaCost: 0,
					task: ''
				}
			],

			lust: 0,
			sexMovesPlayed: [],
		};
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

	jumpToNight() {
		this.setUpCharacters();

		// set pleasure to a random value

		this.setState(state => {
			const {
				characters,
			} = state;

			return {
				characters: characters.map(character => {
					const clone = {...character};

					clone.stats.pleasure = randomPercentage();

					return clone;
				}),
				shift: Shift.NIGHT,
				lust: 0,
				sexMovesPlayed: [],
			};
		});

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

	getCharacter(id) {
		return this.state.characters.find(character => {
			return character.id === id;
		}) || null;
	}

	getTask(id) {
		return TasksDatabase.tasks.find(task => {
			return task.id === id;
		}) || null;
	}

	getSexMove(id) {
		return SexMovesDatabase.sexMoves.find(move => {
			return move.id === id;
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

		return Math.clamp(value, 0, maxValue);
	}

	shuffleCards(cards) {
		const copy = [];

		for (let n = cards.length; n > 0; n--) {
			let i = Math.floor(Math.random() * n);
			copy.push(cards.splice(i, 1)[0]);
		}

		return copy;
	}

	canBePlaced(characterId, task) {
		const character = this.getCharacter(characterId);
		return (task.difficulty === 0) || (character.stats.stamina > 0);
	}

	setCharacterTask(characterId, task) {
		if (!this.canBePlaced(characterId, task)) {
			return;
		}

		this.setState(state => {
			return {
				characters: state.characters.map(character => {
					if (character.id !== characterId) {
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

		if (this.state.shift === Shift.NIGHT) {
			const character = this.getCharacter(characterId);

			this.setState({
				lust: character.stats.pleasure
			});
		}
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
		if (this.state.shift === Shift.EVENING) {
			this.jumpToNight();

			return;
		}

		// update shift

		this.setState(state => {
			let {
				shift,
				day,
			} = state;

			if (shift === Shift.NIGHT) {
				shift = Shift.MORNING;
				day++;
			} else {
				shift++;
			}

			return {
				day,
				shift
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
						return {...it, staminaCost};
					} else {
						return it;
					}
				}),
			}
		});
	}

	get nightCharacter() {
		return this.state.characters.find(character => character.task?.id === 'night') ?? null;
	}

	canSexMoveBePlayed(sexMoveId) {
		if (!this.nightCharacter) {
			return false;
		}

		const sexMove = this.getSexMove(sexMoveId);
		return (this.state.lust>= sexMove.lustMinimum);
	}

	playSexMove(sexMoveId) {
		const character = this.nightCharacter;
		if (!character) {
			return;
		}

		const sexMove = {...this.getSexMove(sexMoveId)};
		sexMove.played = true;

		this.setState(state => {
			let {
				lust,
				sexergy
			} = state;

			sexMove.effects.forEach(effect => {
				switch (effect.type) {
					case 'lust': {
						lust = Math.clamp(lust + effect.value, 0, 100);
						break;
					}
					case 'sexergy': {
						sexergy += effect.value;
						break;
					}
					default: break;
				}
			});

			return {
				lust,
				sexergy,
				sexMovesPlayed: [...state.sexMovesPlayed, sexMove]
			}
		});
	}

	render() {
		const {
			day,
			shift,
			handCards,
			characters,
		} = this.state;

		const charactersUnplaced = characters.filter(character => character.task === '');

		let gameState = null;
		let hud = null;

		if (handCards.length === 0) {
			gameState = (
				<GameStart
					onStartGame={this.startGame.bind(this)}
					onJumpToNight={this.jumpToNight.bind(this)}
				/>
			);
		} else if (shift === Shift.NIGHT) {
			const {
				lust,
				sexMovesPlayed,
			} = this.state;

			const charactersNotDone = [];

			hud = (
				<ShiftHud
					className="o-app__hud"
					day={day}
					shift={shift}
					charactersNotDone={charactersNotDone}
					handleFinishShift={this.finishShift.bind(this)}
				/>
			);

			gameState = (
				<NightShift
					className="o-app__state"
					day={day}
					shift={shift}
					nightTask={this.getTask('night')}
					nightCharacter={this.nightCharacter}
					charactersNotDone={charactersNotDone}
					charactersUnplaced={charactersUnplaced}
					lust={lust}
					sexMoves={SexMovesDatabase.sexMoves}
					sexMovesPlayed={sexMovesPlayed}
					canSexMoveBePlayed={this.canSexMoveBePlayed.bind(this)}
					playSexMove={this.playSexMove.bind(this)}
					clampCharacterStat={this.clampCharacterStat.bind(this)}
					canBePlaced={this.canBePlaced.bind(this)}
					onCharacterDropped={this.setCharacterTask.bind(this)}
					onShiftFinish={this.finishShift.bind(this)}
				/>
			);
		} else {
			const charactersNotDone = characters.filter(character => !character.task || character.task.outcome === '');

			hud = (
				<ShiftHud
					className="o-app__hud"
					day={day}
					shift={shift}
					charactersNotDone={charactersNotDone}
					handleFinishShift={this.finishShift.bind(this)}
				/>
			);

			gameState = (
				<DayShift
					className="o-app__state"
					day={day}
					shift={shift}
					characters={characters}
					charactersNotDone={charactersNotDone}
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
				{hud}
				{gameState}
			</DndProvider>
		);
	}
};
