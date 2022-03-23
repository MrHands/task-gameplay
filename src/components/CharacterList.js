import React from 'react';

import Character from '../components/Character';

import './CharacterList.scss';

export default class CharacterList extends React.Component {
	render() {
		const {
			characters,
			clampCharacterStat,
			canBePlaced,
		} = this.props;

		return (
			<article className={['m-characterList', this.props.className].join(' ')}>
				{characters.map(character => {
					return (
						<Character
							className="m-characterList__item"
							key={`character-${character.id}`}
							clampCharacterStat={clampCharacterStat}
							canBePlaced={canBePlaced}
							{...character}
						/>
					);
				})}
			</article>
		);
	}
}