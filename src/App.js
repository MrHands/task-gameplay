import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import ShiftHud from './components/ShiftHud';
import TasksDatabase from './data/TasksDatabase.json';
import DecksDatabase from './data/DecksDatabase.json';
import SexMovesDatabase from './data/SexMovesDatabase.json';
import { Mood } from './enums/Mood';
import { Shift } from './enums/Shift';
import shuffleCards from './helpers/shuffleCards';
import DayShift from './states/DayShift';
import GameStart from './states/GameStart';
import NightShift from './states/NightShift';

import './App.scss';
import DiceList from './components/DiceList';

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

			dice: [],

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
					task: '',
					location: '',
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
					task: '',
					location: '',
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
					task: '',
					location: '',
				}
			],

			locations: [
				{
					id: 'gym',
					title: 'Gym',
					tasks: [],
					character: null,
				},
				{
					id: 'library',
					title: 'Library',
					tasks: [],
					character: null,
				},
				{
					id: 'dungeon',
					title: 'Dungeon',
					tasks: [],
					character: null,
				},
				{
					id: 'lounge',
					title: 'Lounge',
					tasks: [],
					character: null,
				},
				{
					id: 'spa',
					title: 'Spa',
					tasks: [],
					character: null,
				},
			],

			limitSexMovesHand: true,
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
		this.setUpLocations(false);
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

					// reset task

					cloneCharacter.task = '';
					cloneCharacter.taskEffects = [];

					if (newDay) {
						// reset pleasure

						cloneCharacter.stats.pleasure = 0;

						// add stamina

						cloneCharacter.stats.stamina = this.clampCharacterStat('stamina', cloneCharacter.stats.stamina + 2);
					}

					// reset stamina cost

					cloneCharacter.staminaCost = 1;

					console.log(cloneCharacter);
	
					return cloneCharacter;
				}),
			}
		});
	}

	setUpLocations(isNightShift) {
		this.setState(state => {
			const {
				locations,
				characters,
			} = state;

			// clear characters from locations

			locations.forEach(location => {
				location.character = null;

				location.tasks = TasksDatabase.tasks.filter(task => task.location === location.id).map(task => deepClone(task));
				location.tasks.push(deepClone(this.getTask('rest')));
				
				location.tasks.forEach(task => {
					task.location = location.id;
					task.outcome = '';
				});
			});

			// clear locations from characters

			characters.forEach(character => {
				character.location = '';
			});

			// pick random location for character

			if (!isNightShift) {
				characters.forEach(character => {
					while (character.location === '') {
						const picked = locations[Math.floor(Math.random() * locations.length)];
						if (picked.character === null) {
							picked.character = character;
							character.location = picked.id;
						}
					}
				});
			}

			return {
				locations,
				characters
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

			// roll dice

			const dice = [];
			for (let i = 0; i < 6; ++i) {
				dice.push({
					id: i,
					value: Math.floor(Math.random() * 6) + 1,
				});
			}
	
			const handCards = [];

			if (tasksDeck.length <= characters.length) {
				// build deck

				const deckTasks = DecksDatabase.decks.find(deck => {
					return deck.id === this.state.deck;
				});
				console.log(deckTasks);

				tasksDeck = shuffleCards(deckTasks.tasks.map(id => {
					return deepClone(this.getTask(id));
				}));
				console.log(tasksDeck);

				const deckRest = DecksDatabase.decks.find(deck => {
					return deck.id === 'rest';
				});

				restDeck = shuffleCards(deckRest.tasks.map(id => {
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
				dice,
				handCards: shuffleCards(handCards),
				tasksDeck,
				restDeck,
			}
		});
	}

	getCharacter(id) {
		return this.state.characters.find(character => character.id === id) || null;
	}

	getLocation(id) {
		return this.state.locations.find(location => location.id === id) || null;
	}

	getTask(id) {
		return TasksDatabase.tasks.find(task => task.id === id) || null;
	}

	getDice(id) {
		return this.state.dice.find(dice => dice.id === id) || null;
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

	canDiceBeDropped(diceId, task, character) {
		if (!character) {
			return [false, null];
		}

		const dice = this.state.dice.find(dice => dice.id === diceId) || null;
		if (!dice) {
			return [false, null];
		}

		const required = task.difficulty;
		const stamina = character.stats.stamina;

		console.log(`canDiceBeDropped stamina ${stamina} value ${dice.value} required ${required}`);

		return [true, dice];
	}

	setTaskDice(diceId, task, character) {
		if (!this.canDiceBeDropped(diceId, task, character)) {
			return;
		}

		console.log(`setTaskDice diceId ${diceId} task ${task}`);

		const dice = this.state.dice.find(dice => dice.id === diceId);
		if (task.id === 'rest') {
			task.dice = dice;
		} else {
			task.difficulty = Math.max(0, task.difficulty - dice.value);
		}

		this.setState(state => {
			return {
				dice: state.dice.filter(dice => dice.id !== diceId)
			}
		});

		if (task.difficulty === 0) {
			this.startTask(character, task);
		}
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

	startTask(character, task) {
		if (task.outcome !== '') {
			console.log(`Task ${task.id} was already applied.`);

			return;
		}

		// get location

		const location = this.getLocation(task.location);
		if (!location) {
			return;
		}

		console.log(`applying task ${task.id} to ${character.name}`);

		character.taskEffects = task.effects.map(effect => deepClone(effect));

		// add stamina effect

		if (task.id === 'rest') {
			character.taskEffects.push({
				type: 'stamina',
				value: task.dice.value
			});
		} else {
			const staminaUsed = Math.min(character.stats.stamina, task.difficulty);
	
			character.taskEffects.push({
				type: 'stamina',
				value: -staminaUsed
			});
		}

		// apply task effects

		character.taskEffects.forEach(effect => {
			const statValue = character.stats[effect.type];
			console.log(`type ${effect.type} value ${statValue} effect ${effect.value}`);
			character.stats[effect.type] = this.clampCharacterStat(effect.type, statValue + effect.value);
		});

		// update task

		if (task.id === 'rest') {
			task.dice = null;

			location.tasks = location.tasks.map(it => {
				if (it.id !== task.id) {
					return it;
				}
	
				return task;
			});
		} else {
			location.tasks = location.tasks.filter(it => it.id !== task.id);
		}

		this.setState(state => {
			const {
				characters,
				locations,
			} = state;

			return {
				characters: characters.map(it => {
					if (it.id !== character.id) {
						return it;
					}

					return character;
				}),
				locations: locations.map((it) => {
					if (it.id !== location.id) {
						return it;
					}

					return location;
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

			// lock in sexergy gains

			this.setState(state => {
				const {
					sexergy,
					sexergyGenerated
				} = state;

				return {
					sexergy: sexergy + sexergyGenerated
				}
			})
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

		// set up board

		this.setUpCharacters(newDay);
		this.setUpLocations(shift === Shift.NIGHT);
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
				mood,
			} = state;

			const sexMovesPlayed = [...state.sexMovesPlayed, sexMove];
			console.log(sexMovesPlayed);

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

			let moveSexergy = 0;

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
						moveSexergy = effect.value;
						break;
					}
					default: break;
				}
			});

			// check game over

			const captainOrgasm = captainLust >= 100;
			const crewOrgasm = crewLust >= 200;
			const gameOver = captainOrgasm;

			// crew orgasm!

			if (crewOrgasm) {
				nightLog.push(`*${character.name} had an orgasm!*`);

				moveSexergy *= 2;

				nightLog.push(`Doubled sexergy generated from ${sexMove.title}: **+${moveSexergy}**`);

				if (!gameOver) {
					nightLog.push(`Resetting ${character.name}'s lust to 50%`);

					crewLust = 50;
				}
			}

			// captain orgasm!

			if (captainOrgasm) {
				nightLog.push(`*Captain had an orgasm!*`);

				const sexergyBonus = sexMovesPlayed.length * 100;
				sexergyGenerated += sexergyBonus;

				nightLog.push(`Sexergy bonus of ${sexMovesPlayed.length} moves played x 100 = **+${sexergyBonus}**`);
			}

			sexergyGenerated += moveSexergy;

			// game over

			if (gameOver) {
				sexergy += sexergyGenerated;
				sexMoves = [];

				nightLog.push(`Total sexergy generated: **${sexergyGenerated}**`);
				nightLog.push(`*End of night shift*`);
			} else {
				// clamp stats

				crewLust = this.clampCharacterStat('crew', crewLust);
				captainLust = this.clampCharacterStat('captain', captainLust);

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

				nightLog.push(`${character.name}'s mood changed **${mood}**`);
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
				sexMovesPlayed
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
			dice,
			locations,
			shift,
			handCards,
			characters,
		} = this.state;

		const charactersUnplaced = characters.filter(character => character.task === '');

		let gameState = null;
		let hud = null;
		let eleDice = null;

		if (handCards.length === 0) {
			gameState = (
				<GameStart
					onStartGame={this.startGame.bind(this)}
					onJumpToNight={this.jumpToNight.bind(this)}
				/>
			);
		} else if (shift === Shift.NIGHT) {
			const {
				limitSexMovesHand,
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
					limitSexMovesHand={limitSexMovesHand}
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
					dice={dice}
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
					dice={dice}
					handCards={handCards}
					locations={locations}
					getCharacter={this.getCharacter.bind(this)}
					clampCharacterStat={this.clampCharacterStat.bind(this)}
					canBePlaced={this.canBePlaced.bind(this)}
					onCharacterDropped={this.setCharacterTask.bind(this)}
					canDiceBeDropped={this.canDiceBeDropped.bind(this)}
					onDiceDropped={this.setTaskDice.bind(this)}
					onStaminaChange={this.staminaChange.bind(this)}
					onTaskStart={this.startTask.bind(this)}
					onShiftFinish={this.finishShift.bind(this)}
				/>
			);

			eleDice = (
				<DiceList
					className="o-dayShift__dice"
					dice={dice}
				/>
			);
		}

		return (
			<DndProvider backend={HTML5Backend}>
				{hud}
				{gameState}
				{eleDice}
			</DndProvider>
		);
	}
};
