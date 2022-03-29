import React from 'react';
import CountUp from 'react-countup';

import CharacterList from '../components/CharacterList';
import LustBar from '../components/LustBar';
import NightPlayArea from '../components/NightPlayArea';
import SexMove from '../components/SexMove';
import SexMoveCategory from '../components/SexMoveCategory';

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
			mood,
			nightCharacter,
			crewLust,
			captainLust,
			sexMoves,
			sexMovesPlayed,
			sexergyGenerated,
			categoriesExpanded,
			toggleExpandCategory,
			canSexMoveBePlayed,
			handleFinishShift,
		} = this.props;

		const movesSelected = [...sexMovesPlayed];
		if (nightCharacter !== null && sexMovesPlayed.length < 5) {
			movesSelected.push({
				id: -1
			});
		}

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

		return (
			<article className="o-nightShift">
				<div className="o-nightShift__lust">
					<LustBar
						className="o-nightShift__lust__captain -captain"
						name={'Captain'}
						lust={captainLust}
					/>
					<LustBar
						className="o-nightShift__lust__crew"
						name={nightCharacter?.name || 'Crew'}
						lust={crewLust}
					/>
				</div>
				<div className="o-nightShift__sexergy">
					<h2 className="o-nightShift__sexergy__title">Sexergy Earned</h2>
					<h2 className="o-nightShift__sexergy__value">
						<CountUp
							end={sexergyGenerated}
							duration={1}
						/>
					</h2>
				</div>
				<div className="o-nightShift__shift">
					<button className="o-nightShift__shift__finish" onClick={handleFinishShift}>
						Finish Shift
					</button>
				</div>
				<div className="o-nightShift__mood">
					<h3 className="o-nightShift__mood__title">Mood</h3>
					<h2 className="o-nightShift__mood__value">{mood}</h2>
				</div>
				<div className="o-nightShift__moves">
				<h2 className="o-nightShift__moves__title">Sex Moves</h2>
					<div className="o-nightShift__moves__container">
						<div className="o-nightShift__moves__scroll">
							{Object.entries(movesByCategory).map((category) => {
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
							})}
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