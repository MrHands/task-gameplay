import React from 'react';

import Character from '../components/Character';

import './CharacterList.scss';

export default class CharacterList extends React.Component {
	get classes() {
		const {
			className
		} = this.props;

		const classes = ['m-characterList'];
		classes.push(className);

		return classes;
	}

	render() {
		const {
			characters,
			clampCharacterStat,
			canBePlaced,
		} = this.props;

		return (
			<article className={this.classes.join(' ')}>
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