import React from 'react';

import './NightLog.scss';

export default class NightLog extends React.Component {
	get classes() {
		const {
			className,
		} = this.props;

		const classes = ['m-nightLog'];

		classes.push(className);

		return classes;
	}

	render() {
		const {
			nightLog,
		} = this.props;

		return (
			<ul className={this.classes.join(' ')}>
				{nightLog.map(entry => {
					return <li>{entry}</li>;
				})}
			</ul>
		);
	}
}