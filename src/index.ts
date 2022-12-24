import Phaser = require('phaser');
import { Game } from './Game';
import { GameScene } from './GameScene';
import { UIScene } from './UIScene';

new Game({
	type: Phaser.AUTO,
	parent: 'phaser-container',
	backgroundColor: '#33A5E7',
	scale: {
		mode: Phaser.Scale.RESIZE,
		width: '100%',
		height: '100%',
		min: {
			width: 400,
			height: 400
		}
	},
	scene: [GameScene, UIScene]
});
