const answerResponses = [
	{
		regex: /^ *fool'?s? ?mate *$/i,
		response: JSON.stringify({
			text: 'correct! well done. the next puzzle is at inoxn/coin.'
		})
	},
	{
		regex: /^ *chess *$/i,
		response: JSON.stringify({
			text: 'you have the right idea.'
		})
	},
	{
		regex: /^ *check[ -]*mate *$/i,
		response: JSON.stringify({
			text: 'you are very close.'
		})
	}
]

const replyToAnswer = (res, query) => {
	//finds the matching response. if none exist, this variable gets set to an empty response.
	const {response} = (
		answerResponses.find( ({regex, response}) => regex.test(query.answer) )
		|| {response: '{}'}
	)
	res.writeHead(200, {'Content-Type': 'application/json'})
	res.write(response)
	res.end()
}


module.exports = replyToAnswer