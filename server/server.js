const http = require('http')
const fs = require('fs')
const url = require('url')
const WebSocket = require('ws')

const replyToDunceAnswer = require('./puzzles/dunce/replyToAnswer')
const connectCoinFlipStream = require('./puzzles/coin/flipStream')
const createStockfishRoom = require('./puzzles/master/stockfishServer')


const index = {
	contentType: 'text/html',
	path: __dirname + '/puzzles/index.html'
}
const urlPathsToFiles = {
	'': index, '/': index,
	'/default.css': {
		contentType: 'text/css',
		path: __dirname + '/puzzles/default.css'
	},
	'/jquery.js': {
		contentType: 'text/javascript',
		path: __dirname + '/jquery-3.4.1.min.js'
	},
	'/dunce': {
		contentType: 'text/html',
		path: __dirname + '/puzzles/dunce/index.html'
	},
	'/inoxn/coin': {
		contentType: 'text/html',
		path: __dirname + '/puzzles/coin/index.html',
	},
	'/inoxn/coin/huffmanTree': {
		contentType: 'application/json',
		path: __dirname + '/puzzles/coin/huffmanTree.json'
	},
	'/gtrwj/books': {
		contentType: 'text/html',
		path: __dirname + '/puzzles/books/index.html'
	},
	'/gdfsk': {
		contentType: 'text/html',
		path: __dirname + '/puzzles/master/redirect.html'
	},
	'/gdfsk/master': {
		contentType: 'text/html',
		path: __dirname + '/puzzles/master/index.html'
	},
	'/gdfsk/master/chessboard.js': {
		contentType: 'text/javascript',
		path: __dirname + '/puzzles/master/chessboard/chessboard.min.js'
	},
	'/gdfsk/master/chessboard.css': {
		contentType: 'text/css',
		path: __dirname + '/puzzles/master/chessboard/chessboard.min.css'
	}
}

const urlPathsToFunctions = {
	'/dunce/replyToAnswer': replyToDunceAnswer,
	'/gdfsk/master/getPiece': (res, query) => {
		fs.createReadStream(__dirname + '/puzzles/master/chessboard/chesspieces/'+query.name+'.png')
		.pipe(res)
	}
}


const server = http.createServer( (req, res) => {
	const {pathname, query} = url.parse(req.url, true)
	if(pathname in urlPathsToFiles) {
		const { contentType, path: filePath } = urlPathsToFiles[pathname]
		res.writeHead(200, {'Content-Type': contentType})
		fs.createReadStream(filePath).pipe(res)
	}
	else if(pathname in urlPathsToFunctions)
		urlPathsToFunctions[pathname](res, query)
	else {
		res.statusCode = 404
		res.end()
	}
})


const coinFlipServer = new WebSocket.Server({noServer: true})
coinFlipServer.on('connection', connectCoinFlipStream)

const stockfishServer = new WebSocket.Server({noServer: true})
stockfishServer.on('connection', createStockfishRoom)

server.on('upgrade', (req, sock, head) => {
	const pathname = url.parse(req.url).pathname
	if(pathname == '/inoxn/coin/flip') {
		coinFlipServer.handleUpgrade(req, sock, head, conn => {
			coinFlipServer.emit('connection', conn, req)
		})
	}
	else if(pathname == '/gdfsk/master/black') {
		stockfishServer.handleUpgrade(req, sock, head, conn => {
			stockfishServer.emit('connection', conn, req)
		})
	}
	else
		sock.destroy()
})


server.listen({
	host: 'localhost',
	port: 8080
})