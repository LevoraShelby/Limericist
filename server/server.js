const http = require('http')
const fs = require('fs')
const url = require('url')

const replyToDunceAnswer = require('./puzzles/dunce/replyToAnswer')
const flipCoin = require('./puzzles/coin/flip')


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
	'/2mdqj': {
		//puzzle after books. fill out later.
	}
}

const urlPathsToFunctions = {
	'/dunce/replyToAnswer': replyToDunceAnswer,
	'/inoxn/coin/flip': flipCoin
}


const server = http.createServer( (req, res) => {
	const urlObj = url.parse(req.url, true)
	if(urlObj.pathname in urlPathsToFiles) {
		const { contentType, path: filePath } = urlPathsToFiles[urlObj.pathname]
		res.writeHead(200, {'Content-Type': contentType})
		fs.createReadStream(filePath).pipe(res)
	}
	else if(urlObj.pathname in urlPathsToFunctions)
		urlPathsToFunctions[urlObj.pathname](res, urlObj.query)
	else {
		res.statusCode = 404
		res.end()
	}
})


server.listen(8080)