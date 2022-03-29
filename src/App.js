import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import ShiftHud from './components/ShiftHud';
import TasksDatabase from './data/TasksDatabase.json';
import DecksDatabase from './data/DecksDatabase.json';
import SexMovesDatabase from './data/SexMovesDatabase.json';
import { Mood } from './enums/Mood';
import { Shift } from './enums/Shift';
import { TaskOutcome } from './enums/TaskOutcome';
import DayShift from './states/DayShift';
import GameStart from './states/GameStart';
import NightShift from './states/NightShift';

import './App.scss';

function deepClone(object) {
	return JSON.parse(JSON.stringify(object));
}

Math.clamp = (value, min, max) => {
	return Math.max(min, Math.min(value, max));
}

function randomValue(min, max) {
	return min + Math.floor(Math.random() * (max - min));
}

export default class App extends React.Component {
	constructor() {
		super();

		this.state = {
			day: 1,
			shift: Shift.MORNING,
			sexergy: 0,
			sexergyGenerated: 0,

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
						submissive: 0
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
						submissive: 0
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
						submissive: 0
					},
					staminaCost: 0,
					task: ''
				}
			],

			nightLog: [],
			crewLust: 0,
			captainLust: 0,
			mood: Mood.SUBMISSIVE,
			sexMoves: [],
			sexMovesPlayed: [],
			categoriesExpanded: {
				Petting: false,
				Oral: false,
				Sex: false,
				Anal: false,
				Kinky: false,
			},
		};
	}

	addToNightLog(text) {
		this.setState(state => {
			return {
				nightLog: [...state.nightLog, text]
			}
		});
	}

	startGame() {
		this.setUpCharacters(true);
		this.drawHand();
	}

	startNight() {
		this.setState({
			nightLog: [],
			sexergyGenerated: 0,
			crewLust: 0,
			captainLust: 0,
			mood: '',
			sexMovesPlayed: [],
		});
	}

	jumpToNight() {
		this.setUpCharacters(true);

		// set up characters

		this.setState(state => {
			const {
				characters,
			} = state;

			return {
				characters: characters.map(character => {
					const clone = deepClone(character);

					clone.stats.pleasure = randomValue(0, 100);
					clone.stats.passionate = randomValue(0, 100);
					clone.stats.intimate = randomValue(0, 100);
					clone.stats.submissive = randomValue(0, 100);

					return clone;
				}),
				shift: Shift.NIGHT,
			};
		});

		this.startNight();

		this.drawHand();
	}

	setUpCharacters(newDay) {
		this.setState(state => {
			const {
				characters,
			} = state;

			return {
				characters: characters.map(character => {
					const cloneCharacter = deepClone(character);

					if (newDay) {
						// reset task

						cloneCharacter.task = '';

						// reset pleasure

						if (cloneCharacter.id === this.nightCharacter?.id) {
							cloneCharacter.stats.pleasure = 0;
						}

						// add stamina

						cloneCharacter.stats.stamina = this.clampCharacterStat('stamina', cloneCharacter.stats.stamina + 2);
					} else {
						// apply task effects
		
						if (cloneCharacter.task) {
							console.log(`applying task ${cloneCharacter.task} to ${cloneCharacter.name}`);

							cloneCharacter.task.effects.forEach(effect => {
								const statValue = cloneCharacter.stats[effect.type];
								// console.log(`type ${effect.type} value ${statValue} effect ${effect.value}`);
								cloneCharacter.stats[effect.type] = this.clampCharacterStat(effect.type, statValue + effect.value);
							});
							cloneCharacter.task = '';
						}
					}

					// reset stamina cost

					cloneCharacter.staminaCost = 1;
	
					return cloneCharacter;
				}),
			}
		});
	}

	drawHand() {
		this.setState(state => {
			let {
				characters,
				tasksDeck,
				restDeck
			} = state;
	
			const handCards = [];

			if (tasksDeck.length <= characters.length) {
				// build deck

				const deckTasks = DecksDatabase.decks.find(deck => {
					return deck.id === this.state.deck;
				});
				console.log(deckTasks);

				tasksDeck = this.shuffleCards(deckTasks.tasks.map(id => {
					return deepClone(this.getTask(id));
				}));
				console.log(tasksDeck);

				const deckRest = DecksDatabase.decks.find(deck => {
					return deck.id === 'rest';
				});

				restDeck = this.shuffleCards(deckRest.tasks.map(id => {
					return deepClone(this.getTask(id));
				}));
			}

			// deep copy to avoid copying effects array as references!
	
			for (let i = 0; i < characters.length; ++i) {
				const task = deepClone(tasksDeck.pop());
				task.handId = handCards.length;
				handCards.push(task);
			}
	
			for (let i = 0; i < Math.max(1, characters.length - 1); ++i) {
				const task = deepClone(restDeck[0]);
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
				tasksDeck,
				restDeck,
			}
		});
	}

	getCharacter(id) {
		return this.state.characters.find(character => character.id === id) || null;
	}

	getTask(id) {
		return TasksDatabase.tasks.find(task => task.id === id) || null;
	}

	getSexMove(id) {
		if (typeof id !== 'string') {
			return id;
		}

		return this.state.sexMoves.find(move => move.id === id) || null;
	}

	clampCharacterStat(type, value) {
		let maxValue = Infinity;

		switch (type) {
			case 'stamina': {
				maxValue = 5;
				break;
			}
			case 'pleasure':
			case 'crew': {
				maxValue = 200;
				break;
			}
			case 'captain': {
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

					const characterClone = deepClone(character);

					characterClone.task = task;
					task.characterId = characterClone.id;

					if (task.difficulty === 0) {
						characterClone.staminaCost = 0;
					} else {
						characterClone.staminaCost = 1;
					}

					return characterClone;
				})
			}
		});

		if (this.state.shift === Shift.NIGHT) {
			const character = this.getCharacter(characterId);

			let mood = '';

			const moodRoll = randomValue(0, 3);
			switch (moodRoll) {
				case 0: {
					mood = Mood.PASSIONATE;
					break;
				}
				case 1: {
					mood = Mood.INTIMATE;
					break;
				}
				case 2: {
					mood = Mood.SUBMISSIVE;
					break;
				}
				default:
					break;
			}

			this.addToNightLog(`Selected **${character.name}** (passionate: ${character.stats.passionate}, intimate: ${character.stats.intimate}, submissive: ${character.stats.submissive}) for night shift`);
			this.addToNightLog(`Captain starts at 0% lust`);
			this.addToNightLog(`${character.name} starts at ${character.stats.pleasure}% lust`);
			this.addToNightLog(`${character.name}'s mood is **${mood}**`);

			this.setState({
				mood,
				crewLust: character.stats.pleasure,
				sexMoves: SexMovesDatabase.sexMoves.map(sexMove => {
					const clone = deepClone(sexMove);

					clone.effects.forEach(effect => {
						switch (effect.type) {
							case 'sexergy': {
								if (effect.value > 0) {
									effect.value += character.stats[clone.type];
								}
								break;
							}
							default:
								break;
						}
					});

					return clone;
				}),
			});
		}
	}

	startTask(handId) {
		console.log(`startTask ${handId}`);

		this.setState(state => {
			let {
				characters,
				handCards,
			} = state;

			const taskClone = deepClone(handCards.find(task => task.handId === handId));
			if (!taskClone) {
				return {
					characters,
					handCards,
				};
			}

			const characterClone = deepClone(this.getCharacter(taskClone.characterId));

			const bonus = characterClone.staminaCost - 1;

			// determine outcome based on difficulty and roll

			if (taskClone.difficulty > 0) {
				taskClone.roll = Math.floor(Math.random() * 20);
				if (taskClone.roll === 19) {
					taskClone.outcome = TaskOutcome.CRITICAL_SUCCESS;
				} else if (taskClone.roll >= taskClone.difficulty - bonus) {
					taskClone.outcome = TaskOutcome.SUCCESS;
				} else {
					taskClone.outcome = TaskOutcome.FAIL;
				}
			} else {
				taskClone.roll = 0;
				taskClone.outcome = TaskOutcome.SUCCESS;
			}

			// apply outcome to effects

			switch (taskClone.outcome) {
				case TaskOutcome.FAIL: {
					taskClone.effects.forEach(effect => {
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
					taskClone.effects.forEach(effect => {
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

			if (taskClone.difficulty > 0) {
				let staminaEffect = taskClone.effects.find(effect => effect.type === 'stamina');
				if (staminaEffect) {
					staminaEffect.value = -characterClone.staminaCost;
				} else {
					staminaEffect = {
						type: 'stamina',
						value: -characterClone.staminaCost
					};
					taskClone.effects.push(staminaEffect);
				}
			}

			console.log(`task ${taskClone.handId}: roll ${taskClone.roll} difficulty ${taskClone.difficulty} bonus ${bonus} outcome ${taskClone.outcome}`);

			// notify character

			characterClone.task = taskClone;

			return {
				characters: characters.map(character => {
					if (character.id !== characterClone.id) {
						return character;
					}

					return characterClone;
				}),
				handCards: handCards.map(task => {
					if (task.handId !== handId) {
						return task;
					}

					return taskClone;
				}),
			}
		});
	}

	finishShift() {
		// update shift

		let {
			shift,
			day,
		} = this.state;

		console.log(`finishShift shift ${shift} day ${day}`);

		let newDay = false;

		if (shift === Shift.NIGHT) {
			shift = Shift.MORNING;
			day++;

			newDay = true;
		} else {
			shift++;
		}

		if (shift === Shift.NIGHT) {
			this.startNight();
		}

		this.setState({
			day,
			shift
		});

		// update characters

		this.setUpCharacters(newDay);

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
		return (this.state.crewLust >= sexMove.lustMinimum);
	}

	playSexMove(sexMoveId) {
		const character = this.nightCharacter;
		if (!character) {
			return;
		}

		// apply mood bonus

		const sexMove = deepClone(this.getSexMove(sexMoveId));
		sexMove.effects.forEach(effect => {
			switch (effect.type) {
				case 'crew': {
					if (sexMove.type === this.state.mood) {
						effect.value *= 2;
					}
					break;
				}
				default:
					break;
			}
		});
		sexMove.played = true;

		this.setState(state => {
			let {
				crewLust,
				captainLust,
				sexergy,
				sexergyGenerated,
				sexMoves,
				sexMovesPlayed,
				mood,
			} = state;

			// logging

			const nightLog = [...state.nightLog];

			const logEffects = sexMove.effects.map(effect => {
				let result = `${effect.type} `;
				switch (effect.type) {
					case 'crew':
					case 'captain': {
						result += `+${effect.value}%`;
						break;
					}
					default: {
						result += `+${effect.value}`;
						break;
					}
				}
				return result;
			});
			nightLog.push(`Played **${sexMove.title}** (${logEffects.join(', ')})`);

			// apply effects

			sexMove.effects.forEach(effect => {
				switch (effect.type) {
					case 'crew': {
						crewLust += effect.value;
						break;
					}
					case 'captain': {
						captainLust += effect.value;
						break;
					}
					case 'sexergy': {
						sexergyGenerated += effect.value;
						break;
					}
					default: break;
				}
			});

			// cycle mood

			switch (mood) {
				case Mood.PASSIONATE:
					mood = Mood.INTIMATE;
					break;
				case Mood.INTIMATE:
					mood = Mood.SUBMISSIVE;
					break;
				case Mood.SUBMISSIVE:
					mood = Mood.PASSIONATE;
					break;
				default:
					break;
			}

			nightLog.push(`${character.name} changed to a(n) **${mood}** mood`);

			const gameOver = captainLust >= 100;

			// crew orgasm!

			if (crewLust >= 200) {
				const from = sexergyGenerated;

				if (!gameOver) {
					crewLust = 50;
				}

				sexergyGenerated *= 2;

				nightLog.push(`*${character.name} had an orgasm!*`);
				nightLog.push(`Resetting ${character.name}'s lust to 50%`);
				nightLog.push(`2x Sexergy generated from ${from} to **${sexergyGenerated}**`);
			}

			// captain orgasm!

			if (gameOver) {
				sexergyGenerated += 1000;
				sexergy += sexergyGenerated;

				sexMoves = [];

				nightLog.push(`*Captain had an orgasm!*`);
				nightLog.push(`Sexergy bonus of **1000**`);
				nightLog.push(`Total sexergy generated: **${sexergyGenerated}**`);
				nightLog.push(`*End of night shift*`);
			}

			// clamp stats

			if (!gameOver) {
				crewLust = this.clampCharacterStat('crew', crewLust);
				captainLust = this.clampCharacterStat('captain', captainLust);
			}

			console.log(`sexergy ${sexergy} generated ${sexergyGenerated}`);

			return {
				nightLog,
				crewLust,
				captainLust,
				sexergy,
				sexergyGenerated,
				mood,
				sexMoves,
				sexMovesPlayed: [...sexMovesPlayed, sexMove]
			}
		});
	}

	toggleExpandCategory(category) {
		this.setState(state => {
			const newState = {
				categoriesExpanded: {
					...state.categoriesExpanded,
					[category]: !state.categoriesExpanded[category]
				}
			};
			console.log(newState);

			return newState;
		})
	}

	render() {
		const {
			sexergy,
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
				nightLog,
				crewLust,
				captainLust,
				mood,
				sexMoves,
				sexMovesPlayed,
				sexergyGenerated,
				categoriesExpanded,
			} = this.state;

			const charactersNotDone = [];

			gameState = (
				<NightShift
					className="o-app__state"
					nightLog={nightLog}
					day={day}
					shift={shift}
					nightTask={this.getTask('night')}
					nightCharacter={this.nightCharacter}
					charactersNotDone={charactersNotDone}
					charactersUnplaced={charactersUnplaced}
					crewLust={crewLust}
					captainLust={captainLust}
					mood={mood}
					sexMoves={sexMoves}
					sexMovesPlayed={sexMovesPlayed}
					sexergyGenerated={sexergyGenerated}
					categoriesExpanded={categoriesExpanded}
					toggleExpandCategory={this.toggleExpandCategory.bind(this)}
					getSexMove={this.getSexMove.bind(this)}
					canSexMoveBePlayed={this.canSexMoveBePlayed.bind(this)}
					playSexMove={this.playSexMove.bind(this)}
					clampCharacterStat={this.clampCharacterStat.bind(this)}
					canBePlaced={this.canBePlaced.bind(this)}
					onCharacterDropped={this.setCharacterTask.bind(this)}
					onShiftFinish={this.finishShift.bind(this)}
				/>
			);
		} else {
			const charactersNotDone = characters.filter(character => {
				return (
					(!character.task || character.task.outcome === '') &&
					character.stats.stamina > 0
				);
			});
			console.log(charactersNotDone);

			hud = (
				<ShiftHud
					className="o-app__hud"
					sexergy={sexergy}
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
