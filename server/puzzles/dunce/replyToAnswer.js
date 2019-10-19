//TODO: Add regex for '1. f3 e5 2. g4 Qh4#' and similar.

const answerResponses = [
	{
		regex: /^ *fool'?s? *mate *$/i,
		response: 'correct! well done. the next puzzle is at inoxn/coin.'
	},
	{
		regex: /^ *chess *$/i,
		response: 'you have the right idea.'
	},
	{
		regex: /^ *check[ -]*mate *$/i,
		response: 'you are very close, but it\'s not enough.'
	},
	{
		regex: /^ *272 *$/,
		response: 'the numbers matter, but they\'re not the only important part of the names.'
	},
	{
		regex: /^ *h4 *$/i,
		response: 'the final position, but not the answer.'
	}
]

const replyToAnswer = (res, query) => {
	//finds the matching response. if none exist, this variable gets set to an empty response.
	const {response} = (
		answerResponses.find( ({regex, response}) => regex.test(query.answer) )
		|| {response: ''}
	)
	res.writeHead(200, {'Content-Type': 'text/plain'})
	res.write(response)
	res.end()
}


module.exports = replyToAnswer