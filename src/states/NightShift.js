import React from 'react';

import Character from '../components/Character';
import CharacterList from '../components/CharacterList';
import DroppableCard from '../components/DroppableCard';
import LustBar from '../components/LustBar';
import SexMove from '../components/SexMove';

import './NightShift.scss';

export default class NightShift extends React.Component {
	render() {
		const {
			nightTask,
			nightCharacter,
			charactersUnplaced,
			nightLust,
			sexMoves,
			sexMovesPlayed,
			canSexMoveBePlayed,
			playSexMove,
			clampCharacterStat,
			canBePlaced,
			onCharacterDropped,
		} = this.props;

		let characterDropped = null;

		if (nightCharacter !== null) {
			characterDropped = (
				<Character
					clampCharacterStat={clampCharacterStat}
					{...nightCharacter}
				/>
			);
		} else {
			characterDropped = (
				<DroppableCard
					className="o-character -empty"
					task={nightTask}
					onCharacterDropped={onCharacterDropped}
					canBePlaced={canBePlaced}
				>
					<h3 className="o-character__title">Drag character here</h3>
				</DroppableCard>
			);
		}

		const movesSelected = [...sexMovesPlayed];
		if (nightCharacter !== null && sexMovesPlayed.length < 5) {
			movesSelected.push({
				id: -1
			});
		}

		return (
			<article className="o-nightShift">
				<div className="o-nightShift__drop">
					{characterDropped}
				</div>
				<div className="o-nightShift__moves">
					{sexMoves.map((sexMove, index) => {
						return (
							<SexMove
								key={`sex-move-${index}`}
								canSexMoveBePlayed={canSexMoveBePlayed}
								playSexMove={playSexMove}
								{...sexMove}
							/>
						);
					})}
				</div>
				<CharacterList
					className="o-nightShift__characters"
					characters={charactersUnplaced}
					clampCharacterStat={clampCharacterStat}
					canBePlaced={canBePlaced}
				/>
				<div className="o-nightShift__lust">
					<h2 className="o-nightShift__lust__title">Lust</h2>
					<LustBar
						className="o-nightShift__lust__bar"
						value={nightLust}
						max="100"
					/>
					<h2 className="o-nightShift__lust__amount">{`${nightLust}%`}</h2>
				</div>
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
			</article>
		);
	}
}