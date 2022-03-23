import React from 'react';

import CharacterList from '../components/CharacterList';

import './NightShift.scss';

export default class NightShift extends React.Component {
	render() {
		const {
			characters,
			clampCharacterStat,
			canBePlaced,
		} = this.props;

		return (
			<article className="o-nightShift">
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