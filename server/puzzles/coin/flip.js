const coinFlipResults = '011010010011100001111000000110001100101110000100011111110011010110100111101011100010000100111110010001010111100001000111111110011011111010000011110101100111011010110101000111111110101101111110110100001011101101000011011110001001001011001011110010'

const flip = res => {
	res.writeHead(200, {'Content-Type': 'text/plain'})
	//number of three second intervals since epoch.
	const timeInThreeSeconds = Math.floor(Date.now() / 3000)
	const i = timeInThreeSeconds % coinFlipResults.length
	res.write(coinFlipResults[i] == 1 ? 'heads' : 'tails')
	res.end()
}

module.exports = flip