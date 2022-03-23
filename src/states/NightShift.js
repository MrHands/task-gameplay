import React from 'react';

import Character from '../components/Character';
import CharacterList from '../components/CharacterList';
import DroppableCard from '../components/DroppableCard';
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

		let selected = characters.find(character => character.task !== '') ?? null;

		let characterDropped = null;

		if (selected !== null) {
			characterDropped = (
				<Character
					clampCharacterStat={clampCharacterStat}
					{...selected}
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
					<progress value={nightLust} max="100">{`${nightLust}%`}</progress>
				</div>
			</article>
		);
	}
}