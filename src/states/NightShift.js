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
			day,
			shift,
			nightTask,
			characters,
			charactersUnplaced,
			sexMoves,
			nightLust,
			clampCharacterStat,
			canBePlaced,
			onCharacterDropped,
		} = this.props;

		let characterSelected = characters.find(character => character.task !== '') ?? null;

		let characterDropped = null;

		if (characterSelected !== null) {
			characterDropped = (
				<Character
					clampCharacterStat={clampCharacterStat}
					{...characterSelected}
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

		const movesSelected = [
			{ id: -1 },
			{ id: -1 },
			{ id: -1 },
			{ id: -1 },
			{ id: -1 },
		];

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
					<h2>Lust</h2>
					<LustBar
						className="o-nightShift__lust__bar"
						value={nightLust}
						max="100"
					/>
				</div>
				<div className="o-nightShift__selected">
					{movesSelected.map((sexMove, index) => {
						return (
							<SexMove
								key={`selected-move-${index}`}
								{...sexMove}
							/>
						);
					})}
				</div>
			</article>
		);
	}
}