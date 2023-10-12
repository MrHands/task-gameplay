import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import ShiftHud from './components/ShiftHud';
import TasksDatabase from './data/TasksDatabase.json';
import LocationsDatabase from './data/LocationsDatabase.json';
import SexMovesDatabase from './data/SexMovesDatabase.json';
import SexMovesDeck from './data/SexMovesDeck.json';
import LustBalancing from './data/LustBalancing.json';
import { Mood } from './enums/Mood';
import { Shift } from './enums/Shift';
import shuffleCards from './helpers/shuffleCards';
import DayShift from './states/DayShift';
import GameStart from './states/GameStart';
import NightShift from './states/NightShift';

import './App.scss';
import DiceList from './components/DiceList';

const STAMINA_MAXIMUM = 5;
const SEX_MOVES_INITIAL_HAND = 5;
const SEX_MOVES_DRAW_HAND = 5;
const PLAY_SEX_MOVES_MAXIMUM = 3;
const REDRAW_MAXIMUM = 2;

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
			gameStarted: false,

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
					id: 1000,
					name: 'Captain',
					stats: {
						stamina: STAMINA_MAXIMUM,
					},
					staminaCost: 0,
					task: '',
					location: 'captain',
				},
				{
					id: 0,
					name: 'Chichi',
					stats: {
						stamina: 5,
						pleasure: 0,
						passionate: randomValue(1, 6),
						intimate: randomValue(1, 6),
						submissive: randomValue(1, 6)
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
						passionate: randomValue(1, 6),
						intimate: randomValue(1, 6),
						submissive: randomValue(1, 6)
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
						passionate: randomValue(1, 6),
						intimate: randomValue(1, 6),
						submissive: randomValue(1, 6)
					},
					staminaCost: 0,
					task: '',
					location: '',
				}
			],
			locations: LocationsDatabase.locations.map((location) => {
				return Object.assign(deepClone(location), {
					tasks: [],
					character: null,
				});
			}),

			limitSexMovesHand: true,
			nightLog: [],
			crewLust: 0,
			crewShield: 0,
			crewNextMood: 0,
			captainLust: 0,
			mood: Mood.SUBMISSIVE,
			sexMovePlaysLeft: PLAY_SEX_MOVES_MAXIMUM,
			sexMoves: [],
			sexMovesInHand: [],
			sexMovesPlayed: [],
			categoriesExpanded: {
				Petting: false,
				Oral: false,
				Sex: false,
				Anal: false,
				Kinky: false,
			},
			shiftHeld: false,
			redrawsRemaining: REDRAW_MAXIMUM,
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

		this.drawHand(STAMINA_MAXIMUM);
	}

	startNight() {
		this.setState({
			nightLog: [],
			sexergyGenerated: 0,
			crewLust: 0,
			crewShield: 0,
			crewNextMood: 3,
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
				gameStarted: true,
			};
		});

		this.startNight();

		this.drawHand(STAMINA_MAXIMUM);
	}

	setUpCharacters(newDay) {
		this.setState(state => {
			const {
				characters,
			} = state;

			return {
				characters: characters.map(character => {
					if (character.id === 1000) {
						return character;
					}

					const cloneCharacter = deepClone(character);

					// reset task

					cloneCharacter.task = '';
					cloneCharacter.taskEffects = [];

					if (newDay) {
						// reset pleasure

						cloneCharacter.stats.pleasure = 0;
					}
	
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

				const locationDb = LocationsDatabase.locations.find(it => it.id === location.id);

				location.tasks = locationDb.tasks.map(id => {
					const found = TasksDatabase.tasks.find(it => it.id === id);
					return Object.assign(deepClone(found), {
						location: location.id,
						outcome: ''
					});
				});
			});

			// clear locations from characters

			characters.forEach(character => {
				character.location = '';
			});

			// pick random location for character

			if (!isNightShift) {
				characters.forEach(character => {
					if (character.id === 1000) {
						locations[0].character = character;
						character.location = locations[0].id;
						return character;
					}

					while (character.location === '') {
						const picked = locations[Math.floor(Math.random() * locations.length)];
						if (picked.id !== 'captain' &&
							picked.character === null) {
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

	drawHand(diceCount) {
		this.setState(state => {
			// roll dice

			const dice = [];
			for (let i = 0; i < diceCount; ++i) {
				dice.push({
					id: i,
					value: randomValue(1, 7),
					isSpent: false,
				});
			}

			return {
				dice,
				gameStarted: true,
			}
		});
	}

	fillSexMovesDeck(character) {
		this.setState({
			sexMoves: SexMovesDeck.decks[0].sexMoves.map((id, index) => {
				const sexMove = deepClone(SexMovesDatabase.sexMoves.find(move => move.id === id));
				sexMove.id = `${id}-deck-${index}`;
				sexMove.effects.forEach(effect => {
					switch (effect.type) {
						case 'sexergy': {
							if (effect.value > 0) {
								effect.value += character.stats[sexMove.type];
							}
							break;
						}
						default:
							break;
					}
				});

				return sexMove;
			})
		});
	}

	drawSexMoveHand(cardCount, keepHandCards = false) {
		if (this.state.sexMoves.length <= cardCount) {
			this.fillSexMovesDeck(this.nightCharacter);
		}

		this.setState(state => {
			let {
				sexMoves,
				sexMovesInHand
			} = state;

			const cardsDeck = shuffleCards([...sexMoves]);
			const cardsHand = keepHandCards ? [...sexMovesInHand] : [];
			
			let playable = 0;
			for (const card of cardsHand) {
				if (this.canSexMoveBePlayed(card)) {
					playable += 1;
				}
			}
			
			console.log(`BEFORE cardsHand ${cardsHand.length} cardsDeck ${cardsDeck.length} playable ${playable}`);

			for (let i = 0; i < cardCount - 1; i += 1) {
				const nextCard = cardsDeck[0];
				cardsDeck.splice(0, 1);

				if (this.canSexMoveBePlayed(nextCard)) {
					playable += 1;
				}

				cardsHand.push(nextCard);
			}

			console.log(`BETWEEN cardsHand ${cardsHand.length} cardsDeck ${cardsDeck.length} playable ${playable}`);

			// ensure at least one card is playable

			for (let i = 0; i < cardsDeck.length; i += 1) {
				const nextCard = cardsDeck[i];
				if (playable > 0 || this.canSexMoveBePlayed(nextCard)) {
					cardsHand.push(nextCard);
					cardsDeck.splice(0, 1);
					playable += 1;

					break;
				}
			}

			console.log(`AFTER cardsHand ${cardsHand.length} cardsDeck ${cardsDeck.length} playable ${playable}`);

			return {
				sexMoves: cardsDeck,
				sexMovesInHand: cardsHand,
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

		let sexMove = this.state.sexMoves.find(move => move.id === id) || null;
		if (!sexMove) {
			sexMove = this.state.sexMovesInHand.find(move => move.id === id) || null;
		}

		return sexMove;
	}

	clampCharacterStat(type, value) {
		let maxValue = Infinity;

		switch (type) {
			case 'stamina': {
				maxValue = STAMINA_MAXIMUM;
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

	canDiceBeDropped(diceId, task, character, slotIndex) {
		if (!character) {
			return [false, null];
		}

		const dice = this.state.dice.find(dice => dice.id === diceId) || null;
		if (dice === null) {
			return [false, null];
		}

		slotIndex = slotIndex || 0;
		const slot = task.requirements[slotIndex];

		if (task.id === 'reroll') {
			return [character.stats.stamina > 0, dice];
		}

		switch (slot.type) {
			case 'min': {
				return [dice.value >= slot.value, dice];
			}
			case 'max': {
				return [dice.value <= slot.value, dice];
			}
			default:
				return [dice !== null, dice];
		}
	}

	setTaskDice(diceId, task, character, slotIndex) {
		const result = this.canDiceBeDropped(diceId, task, character);
		if (!result[0]) {
			return;
		}

		console.log(`setTaskDice diceId ${diceId} task ${task} slotIndex ${slotIndex}`);
		console.log(task);

		// remove die from list

		const dice = this.state.dice.find(dice => dice.id === diceId);

		// set die on slot

		const slot = task.requirements[slotIndex];

		switch (slot.type) {
			case 'gate': {
				slot.value -= dice.value;
				break;
			}
			default:
				slot.dice = dice;
				break;
		}

		// check if task was completed

		let isDone = task.requirements.reduce((previous, slot, index) => {
			console.log(`previous ${previous} slot ${index} dice ${slot.dice} type ${slot.type}`);

			switch (slot.type) {
				case 'tool': {
					return previous && slot.dice !== null;
				}
				case 'gate': {
					return previous && slot.value <= 0;
				}
				case 'min': {
					return previous && slot.dice !== null && slot.dice.value >= slot.value;
				}
				case 'max': {
					return previous && slot.dice !== null && slot.dice.value <= slot.value;
				}
				default:
					return previous;
			}
		}, true);

		// special tasks

		if (task.id === 'reroll') {
			this.setState(state => {
				return {
					characters: state.characters.map(it => {
						if (it.id !== character.id) {
							return it;
						}

						const clone = deepClone(character);
						clone.stats.stamina -= 1;
						return clone;
					}),
					dice: state.dice.map(it => {
						if (it.id !== diceId) {
							return it;
						}

						let value = dice.value;
						do {
							value = randomValue(1, 7);
						} while(value === dice.value)

						return {
							id: diceId,
							value,
						};
					})
				}
			});

			slot.dice = null;

			return;
		}

		// update state

		this.setState(state => {
			return {
				dice: state.dice.map(it => {
					if (it.id !== diceId) {
						return it;
					}

					const clone = deepClone(it);
					clone.isSpent = true;
					return clone;
				})
			}
		});

		if (isDone) {
			this.startTask(character, task);
		}
	}

	canBePlaced(characterId, task) {
		return true;
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
				crewLust: Math.round(character.stats.pleasure / 100 * LustBalancing.lustLevelsXp[0]),
				sexMovesInHand: [],
				sexMovesPlayed: [],
			});

			this.fillSexMovesDeck(character);
			this.endNightTurn(SEX_MOVES_INITIAL_HAND);
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

		const slot = task.requirements[0];

		// apply task effects

		character.taskEffects.forEach(effect => {
			const statValue = character.stats[effect.type];

			let effectValue = effect.value;

			if ('add' in effect) {
				if (effect.add === 'dice') {
					effectValue += slot.dice.value;
				} else {
					effectValue += character.stats[effect.add];
				}
			}

			if ('multiply' in effect) {
				if (effect.multiply === 'dice') {
					effectValue *= slot.dice.value;
				} else {
					effectValue *= character.stats[effect.multiply];
				}
			}

			console.log(`effect ${effect.type} slot ${slot.type} value ${statValue} effect ${effectValue}`);
			character.stats[effect.type] = this.clampCharacterStat(effect.type, statValue + effectValue);
		});

		// clamp pleasure

		if (this.state.shift !== Shift.NIGHT) {
			character.stats['pleasure'] = Math.clamp(character.stats['pleasure'], 0, 100);
		}

		// update task

		location.tasks = location.tasks.filter(it => it.id !== task.id);

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
					sexergyGenerated,
					characters,
				} = state;

				const newCharacters = characters.map((character) => {
					if (character.id === 1000) {
						character.stats.stamina = STAMINA_MAXIMUM;
					} else {
						character.stats.pleasure = 0;
					}
					return character;
				});

				return {
					sexergy: sexergy + sexergyGenerated,
					characters: newCharacters
				}
			});
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
		this.drawHand(STAMINA_MAXIMUM);
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

		const {
			crewLust,
		} = this.state;

		const sexMove = this.getSexMove(sexMoveId);
		if (sexMove == null) {
			return false;
		}

		return sexMove.lustMinimum <= crewLust;
	}

	getLustLevel(lust) {
		const result = {
			xpCurrent: lust,
			xpNext: LustBalancing.lustLevelsXp[0],
			level: 0
		};

		for (let i = 1; i < LustBalancing.lustLevelsXp.length; ++i) {
			const levelXp = LustBalancing.lustLevelsXp[i];

			// console.log(`lust ${lust} index ${i} levelXp ${levelXp} xpCurrent ${result.xpCurrent} xpNext ${result.xpNext} level ${result.level}`);

			if (result.xpCurrent < result.xpNext) {
				break;
			}

			result.xpCurrent -= result.xpNext;
			result.xpNext = levelXp - result.xpNext;
			result.level += 1;
		}

		return result;
	}

	playSexMove(sexMoveId) {
		const crewMember = this.nightCharacter;
		if (!crewMember) {
			return;
		}

		const {
			shiftHeld,
			redrawsRemaining,
		} = this.state;

		// redraw card when holding shift

		if (shiftHeld) {
			if (redrawsRemaining <= 0) {
				return;
			}

			this.setState(state => {
				let {
					sexMoves,
					sexMovesInHand
				} = state;

				const cardsDeck = [...sexMoves];
	
				const cardsHand = sexMovesInHand.filter((it) => it.id !== sexMoveId);
				cardsHand.push(cardsDeck.splice(0, 1)[0]);
	
				return {
					redrawsRemaining: redrawsRemaining - 1,
					sexMoves: cardsDeck,
					sexMovesInHand: cardsHand,
				}
			});

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
					effect.value /= 10;
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
				crewShield,
				captainLust,
				crewNextMood,
				sexergy,
				sexergyGenerated,
				sexMoves,
				sexMovesInHand,
				sexMovesPlayed,
				mood,
			} = state;

			sexMovesInHand = sexMovesInHand.filter(it => it.id !== sexMove.id);
			sexMovesPlayed.push(sexMove);

			// logging

			const nightLog = [...state.nightLog];

			const logEffects = sexMove.effects.map(effect => {
				let result = `${effect.type} `;
				switch (effect.type) {
					case 'captain': {
						result += `+${effect.value}%`;
						break;
					}
					case 'crew': {
						result += `+${effect.value}`;
						break;
					}
					case 'mood': {
						result += ` = ${effect.value}`;
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

			const lustBefore = this.getLustLevel(crewLust);

			// apply effects

			let moveSexergy = 0;

			sexMove.effects.forEach(effect => {
				switch (effect.type) {
					case 'crew': {
						let lust = effect.value;

						if (crewShield > 0) {
							const damage = Math.min(crewShield, lust);
							lust -= damage;
							crewShield -= damage;
						}

						if (crewShield <= 0) {
							crewLust += lust;
						}
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
					/* case 'mood': {
						mood = effect.value;
						nightLog.push(`${crewMember.name}'s mood changed to **${mood}**`);
						break;
					} */
					default: break;
				}
			});

			sexergyGenerated += moveSexergy;

			// switch moods

			crewNextMood -= 1;
			if (crewNextMood <= 0) {
				switch (mood) {
					case Mood.SUBMISSIVE:
						mood = Mood.PASSIONATE;
						break;
					case Mood.PASSIONATE:
						mood = Mood.INTIMATE;
						break;
					case Mood.INTIMATE:
						mood = Mood.SUBMISSIVE;
						break;
					default:
						break;
				}

				nightLog.push(`${crewMember.name}'s mood changed to **${mood}**`);

				crewNextMood = 3;
			}

			// lust message

			const lustAfter = this.getLustLevel(crewLust);

			if (lustAfter.level > lustBefore.level) {
				if (lustBefore.level === 0) {
					nightLog.push(`${crewMember.name} is ready to **fuck!**`);
				} else {
					nightLog.push(`${crewMember.name} had an **orgasm**!`);
				}
			}

			// nightLog.push(`before (${lustBefore.level}, ${lustBefore.xpCurrent}, ${lustBefore.xpNext}) after (${lustAfter.level}, ${lustAfter.xpCurrent}, ${lustAfter.xpNext})`);

			console.log(`sexergy ${sexergy} generated ${sexergyGenerated} crewLust ${crewLust} crewShield ${crewShield}`);

			return {
				nightLog,
				crewLust,
				crewShield,
				crewNextMood,
				captainLust,
				sexergy,
				sexergyGenerated,
				mood,
				sexMoves,
				sexMovesInHand,
				sexMovesPlayed,
			}
		});
	}

	endNightTurn(cardCount = SEX_MOVES_DRAW_HAND) {
		// play random card from hand

		/* const cardsHand = shuffleCards([...this.state.sexMovesInHand]);
		for (const card of cardsHand) {
			if (this.canSexMoveBePlayed(card)) {
				this.playSexMove(card);

				break;
			}
		} */

		const crewMember = this.nightCharacter;
		if (!crewMember) {
			return;
		}

		this.setState(state => {
			let {
				nightLog,
				crewShield,
				captainLust,
				sexergy,
				sexergyGenerated,
				sexMoves,
				sexMovesInHand,
				sexMovesPlayed,
				mood,
				shift,
			} = state;

			// apply mood effect

			switch (mood) {
				case Mood.SUBMISSIVE:
				case Mood.PASSIONATE:
				case Mood.INTIMATE:
					crewShield += randomValue(1, 3);
					break;
				default:
					break;
			}

			console.log(`crewShield ${crewShield}`);

			// check game over

			const captainOrgasm = captainLust >= 100;
			const gameOver = captainOrgasm;

			// captain orgasm!

			if (captainOrgasm) {
				nightLog.push(`*Captain had an orgasm!*`);

				const sexergyBonus = sexMovesPlayed.length * 100;
				sexergyGenerated += sexergyBonus;

				nightLog.push(`Sexergy bonus of ${sexMovesPlayed.length} moves played x 100 = **+${sexergyBonus}**`);
			}

			// game over

			if (gameOver) {
				sexergy += sexergyGenerated;
				sexMoves = [];
				sexMovesInHand = [];

				nightLog.push(`Total sexergy generated: **${sexergyGenerated}**`);
				nightLog.push(`*End of night shift*`);

				shift = Shift.MORNING;
			} else {
				// clamp stats

				captainLust = this.clampCharacterStat('captain', captainLust);
			}

			return {
				nightLog,
				crewShield,
				captainLust,
				sexergy,
				sexergyGenerated,
				mood,
				sexMoves,
				sexMovesInHand,
				sexMovesPlayed,
				sexMovePlaysLeft: PLAY_SEX_MOVES_MAXIMUM,
				redrawsRemaining: REDRAW_MAXIMUM,
				shift,
			}
		});

		if (this.state.shift !== Shift.NIGHT) {
			this.startGame();

			return;
		}

		// draw new cards

		this.drawSexMoveHand(cardCount, false);
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

	componentDidMount() {
		window.addEventListener('keydown', ({key}) => {
			if (key === 'Shift') {
				this.setState({ shiftHeld: true });
			}
		});
		window.addEventListener('keyup', ({key}) => {
			if (key === 'Shift') {
				this.setState({ shiftHeld: false });
			}
		});
	}

	render() {
		const {
			gameStarted,
			sexergy,
			day,
			dice,
			locations,
			shift,
			characters,
		} = this.state;

		const charactersUnplaced = characters.filter(character => character.id !== 1000 && character.task === '');

		let gameState = null;
		let hud = null;
		let eleDice = null;

		if (!gameStarted) {
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
				crewShield,
				crewNextMood,
				captainLust,
				mood,
				sexMovePlaysLeft,
				sexMoves,
				sexMovesInHand,
				sexMovesPlayed,
				sexergyGenerated,
				categoriesExpanded,
				shiftHeld,
				redrawsRemaining,
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
					crewShield={crewShield}
					crewNextMood={crewNextMood}
					captainLust={captainLust}
					mood={mood}
					sexMovePlaysLeft={sexMovePlaysLeft}
					sexMoves={sexMoves}
					sexMovesInHand={sexMovesInHand}
					sexMovesPlayed={sexMovesPlayed}
					sexergyGenerated={sexergyGenerated}
					categoriesExpanded={categoriesExpanded}
					shiftHeld={shiftHeld}
					redrawsRemaining={redrawsRemaining}
					getLustLevel={this.getLustLevel.bind(this)}
					toggleExpandCategory={this.toggleExpandCategory.bind(this)}
					getSexMove={this.getSexMove.bind(this)}
					canSexMoveBePlayed={this.canSexMoveBePlayed.bind(this)}
					playSexMove={this.playSexMove.bind(this)}
					clampCharacterStat={this.clampCharacterStat.bind(this)}
					canBePlaced={this.canBePlaced.bind(this)}
					onCharacterDropped={this.setCharacterTask.bind(this)}
					onEndTurn={this.endNightTurn.bind(this, SEX_MOVES_DRAW_HAND)}
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
