import Phaser = require('phaser');
import { Game } from './Game';
import { GameScene } from './GameScene';

new Game({
	type: Phaser.AUTO,
	parent: 'phaser-container',
	backgroundColor: '#33A5E7',
	scale: {
		mode: Phaser.Scale.ENVELOP,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	scene: [GameScene]
});
