import React from 'react';
import CountUp from 'react-countup';

import './LustBar.scss';

export default class LustBar extends React.Component {
	render() {
		const {
			nameCrew,
			lustCrew,
		} = this.props;

		const style = {
			'--lust-width': `${Math.min(lustCrew, 100)}%`,
			'--overload-width': `${Math.max(lustCrew - 100, 0)}%`,
		};

		const classes = ['o-lustBar'];
		if (lustCrew > 100) {
			classes.push('-overload');
		}
		classes.push(this.props.className);

		return (
			<div
				className={classes.join(' ')}
				style={style}
			>
				<h2 className="o-lustBar__title">{nameCrew}</h2>
				<div className="o-lustBar__bar">
					<div className="o-lustBar__bar__foreground"></div>
					<div className="o-lustBar__bar__foreground -overload"></div>
				</div>
				<h2 className="o-lustBar__amount">
					<CountUp
						end={lustCrew}
						duration={1}
						suffix="%"
					/>
				</h2>
			</div>
		);
	}
}