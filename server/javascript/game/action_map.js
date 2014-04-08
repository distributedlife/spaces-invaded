module.exports = {
	'left_stick': [{target: 'tank', func: 'joystick_move'}],
	'left': [{target: 'tank', func: 'move_left'}],
	'right': [{target: 'tank', func: 'move_right'}],
	'space': [{target: 'tank', func: 'shoot'}],
	'button0': [{target: 'tank', func: 'shoot'}],
	'nothing': [{target: 'tank', func: 'stop'}]
};