import Phaser = require('phaser');
import { Game } from './Game';
import { GameScene } from './GameScene';

new Game({
	type: Phaser.AUTO,
	parent: 'phaser-container',
	backgroundColor: '#33A5E7',
	scale: {
		autoCenter: Phaser.Scale.CENTER_BOTH,
		resizeInterval: 1000,
		width: window.innerWidth,
		height: window.innerHeight
	},
	scene: [GameScene]
});
