const WebSocket = require('ws')
const Chess = require('chess.js').Chess
const stockfish = require('stockfish')


//TODO: Fix engine so that it works asynchronously. (might require proxy server not run in node).
const createRoom = (conn, req) => {
	const engine = stockfish()
	engine.postMessage('uci')
	const game = new Chess()
	engine.onmessage = message => {
		if(message.indexOf('bestmove') != -1) {
			//TODO: Maybe add some logic for if stockfish makes a move that chess.js doesn't agree
			//with (which shouldn't be possible, but they are separate libraries, after all).
			const move = game.move(message.split(' ')[1], {sloppy: true})
			conn.send(JSON.stringify({type: 'move', move: move.san}))
			if(game.game_over())
				engine.postMessage('quit')
			if(game.in_checkmate() && game.turn() == 'w')
				conn.send(JSON.stringify({type: 'text', text: 'Checkmate! You lose!'}))
			else if(game.in_stalemate())
				conn.send(JSON.stringify({type: 'text', text: 'Stalemate! You lose!'}))
			else if(game.in_threefold_repetition())
				conn.send(JSON.stringify({type: 'text', text: 'Threefold repitition! You lose!'}))
		}
	}
	conn.on('message', move => {
		//TODO: Add logic clientside and serverside that can figure out if a message didn't get
		//through. Not strictly necessary nor top priority, but gets rid of a potential annoyance.
		if(game.move(move) != null && !game.game_over()) {
			engine.postMessage('position fen ' + game.fen())
			//TODO: Try to find parameter that might cut down on time when stockfish knows the
			//obvious move (e.g. opening move)
			engine.postMessage('go depth 20 movetime ' + (15 * 1000))
		}
		if(game.in_checkmate() && game.turn() == 'b') {
			engine.postMessage('quit')
			conn.send(JSON.stringify({
				type: 'text', text: 'Checkmate! You win! The next path is /nzpvm/something.'
			}))
		}
	})
	conn.on('close', () => engine.postMessage('quit'))
}


const safeJsonParse = str => {
	try {
		return JSON.parse(str)
	}
	catch(e) {
		return str
	}
}


module.exports = createRoom