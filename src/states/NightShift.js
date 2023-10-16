import React from 'react';
import CountUp from 'react-countup';

import CharacterList from '../components/CharacterList';
import CrewLustBar from '../components/CrewLustBar';
import LustBar from '../components/LustBar';
import NightPlayArea from '../components/NightPlayArea';
import SexMove from '../components/SexMove';
import SexMoveCategory from '../components/SexMoveCategory';
import { Mood } from '../enums/Mood';

import './NightShift.scss';

export default class NightShift extends React.Component {
	playSexMove(sexMoveId) {
		this.props.playSexMove(sexMoveId);
	}

	renderCharacters(props) {
		const {
			nightCharacter,
			charactersUnplaced,
			clampCharacterStat,
			canBePlaced,
		} = props;

		if (nightCharacter !== null) {
			return null;
		}

		return (
			<CharacterList
				className="o-nightShift__interact -night"
				characters={charactersUnplaced}
				clampCharacterStat={clampCharacterStat}
				canBePlaced={canBePlaced}
			/>
		);
	}

	renderSelected(props, movesSelected) {
		const {
			nightCharacter,
			canSexMoveBePlayed
		} = props;

		if (nightCharacter === null) {
			return <div className="o-nightShift__selected" />;
		}

		return (
			<div className="o-nightShift__selected">
				{movesSelected.map((sexMove, index) => {
					return (
						<SexMove
							key={`selected-move-${index}`}
							canSexMoveBePlayed={canSexMoveBePlayed}
							{...sexMove}
						/>
					);
				})}
			</div>
		);
	}

	render() {
		const {
			limitSexMovesHand,
			mood,
			nightCharacter,
			crewLust,
			crewShield,
			crewNextMood,
			captainLust,
			sexMoves,
			sexMovesInHand,
			sexMovesPlayed,
			sexergyGenerated,
			categoriesExpanded,
			toggleExpandCategory,
			getSexMove,
			canSexMoveBePlayed,
			onEndTurn,
			onShiftFinish,
			shiftHeld,
			getLustLevel,
		} = this.props;

		const movesSelected = [...sexMovesPlayed];
		if (nightCharacter !== null && sexMovesPlayed.length < 5) {
			movesSelected.push({
				id: -1
			});
		}

		let eleSexMoves = null;
		if (limitSexMovesHand) {
			eleSexMoves = sexMovesInHand.map((sexMove, index) => {
				return (
					<SexMove
						key={`sex-move-${index}`}
						mood={mood}
						crewLust={crewLust}
						getSexMove={getSexMove}
						canSexMoveBePlayed={canSexMoveBePlayed}
						playSexMove={this.playSexMove.bind(this)}
						shiftHeld={shiftHeld}
						{...sexMove}
					/>
				);
			})
		} else {
			const categories = [
				'Petting',
				'Oral',
				'Sex',
				'Anal',
				'Kinky'
			];
			const movesByCategory = {};
			categories.forEach(category => {
				movesByCategory[category] = sexMoves.filter(sexMove => sexMove.category === category);
			});

			eleSexMoves = Object.entries(movesByCategory).map((category) => {
				return (
					<SexMoveCategory
						key={`category-${category[0]}`}
						mood={mood}
						category={category[0]}
						sexMoves={category[1]}
						canSexMoveBePlayed={canSexMoveBePlayed}
						playSexMove={this.playSexMove.bind(this)}
						expanded={categoriesExpanded[category[0]]}
						toggleExpand={toggleExpandCategory}
					/>
				);
			});
		}

		let moodEffect = '';
		switch (mood) {
			case Mood.INTIMATE: {
				moodEffect = 'She will add 2 shield on her turn.';
				break;
			}
			case Mood.PASSIONATE: {
				moodEffect = 'She will add 20% to Captain bar.';
				break;
			}
			case Mood.SUBMISSIVE: {
				moodEffect = 'She will gain 2 Orgasm.';
				break;
			}
			default:
				break;
		}

		const classNames = ['o-nightShift'];
		if (nightCharacter == null) {
			classNames.push('o-nightShift--start');
		}

		return (
			<article className={classNames.join(' ')}>
				<div className="o-nightShift__lust">
					<LustBar
						className="o-nightShift__lust__captain -captain"
						name={'Captain'}
						overload={false}
						lust={captainLust}
					/>
					<CrewLustBar
						className="o-nightShift__lust__crew"
						name={nightCharacter?.name || 'Crew'}
						lust={crewLust}
						shield={crewShield}
						getLustLevel={getLustLevel}
					/>
				</div>
				<div className="o-nightShift__bar">
					<button className="o-nightShift__end" onClick={onShiftFinish}>
						Finish Night
					</button>
					<div className="o-nightShift__sexergy">
						<h2 className="o-nightShift__sexergy__title">Sexergy Generated</h2>
						<h2 className="o-nightShift__sexergy__value">
							<CountUp
								end={sexergyGenerated}
								duration={1}
							/>
						</h2>
					</div>
					
					<button className="o-nightShift__turn" onClick={onEndTurn}>
						End Turn
					</button>
				</div>
				<div className="o-nightShift__mood">
					<h3 className="o-nightShift__mood__title">Mood</h3>
					<h2 className="o-nightShift__mood__value">{mood}</h2>
					<p className="o-nightShift__mood__effect">{crewNextMood}</p>
				</div>
				<div className="o-nightShift__moves">
					<div className="o-nightShift__moves__container">
						<div className="o-nightShift__moves__scroll">
							{eleSexMoves}
						</div>
					</div>
				</div>
				<NightPlayArea
					{...this.props}
					className="o-nightShift__play"
				/>
			</article>
		);
	}
}