import React from 'react';

import './SexMove.scss';

export default class SexMove extends React.Component {
	render() {
		const {
			title,
			lustMinimum,
			effects,
		} = this.props;

		return (
			<div className={['m-sexMove', this.props.className].join(' ')}>
				<h2 className="m-sexMove__title">{title}</h2>
				<ul className="m-sexMove__effects">
					{effects.map((effect, index) => {
						return (
							<li key={`sex-move-effect-${index}`}>
								<h3>{effect.type} {effect.value}</h3>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}