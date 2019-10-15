const coinFlipResults = '011010010011100001111000000110001100101110000100011111110011010110100111101011100010000100111110010001010111100001000111111110011011111010000011110101100111011010110101000111111110101101111110110100001011101101000011011110001001001011001011110010'

const createFlipStream = out => {
	let i = 0
	const flip = () => {
		out(coinFlipResults[i] == 1 ? 'heads' : 'tails')
		i = (i + 1) % coinFlipResults.length
	}
	flip()
	const intervalID = setInterval(flip, 3000)
	return () => clearInterval(intervalID)
}

const connectFlipStream = conn => {
	const endStream = createFlipStream( coinFace => conn.send(coinFace) )
	conn.on('close', endStream)
}


module.exports = connectFlipStream