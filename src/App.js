import './App.css';

import CardsDatabase from './data/CardsDatabase.json';
import React from 'react';

import Character from './components/Character';

export default class App extends React.Component {
	render() {
		return (
			<Character />
		);
	}
};
