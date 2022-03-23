import React from 'react';

import Character from '../components/Character';
import CharacterList from '../components/CharacterList';
import DroppableCard from '../components/DroppableCard';

import './NightShift.scss';

export default class NightShift extends React.Component {
	render() {
		const {
			characters,
			clampCharacterStat,
			canBePlaced,
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
				<DroppableCard className="o-character -empty" {...this.props}>
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
				</div>
				<CharacterList
					className="o-nightShift__characters"
					characters={characters}
					clampCharacterStat={clampCharacterStat}
					canBePlaced={canBePlaced}
				/>
			</article>
		);
	}
}