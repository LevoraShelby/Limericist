const request = require('sync-request')
const fs = require('fs')

const qrOccupiedModules = JSON.parse(fs.readFileSync(__dirname + '/qrCode.json'))

const apiUrl = 'https://api.tomtom.com/search/2/nearbySearch/.json'
const key = '2aaJ3G8AyGtkUOnXi76T2CEr8uW4QOsF'

const angles = radians => radians * (180/Math.PI)
const radians = angles => angles * (Math.PI/180)

const getMercLat = phi => Math.log(Math.tan(phi) + (1/Math.cos(phi)))
const gd = y => (2 * Math.atan(Math.E**y)) - (Math.PI/2)


const first = {x: radians(-116), y: getMercLat(radians(55.8))}
const last = {x: radians(-87.1), y: getMercLat(radians(36.1))}

const getCoords = (col, row) => ({
	x: ((last.x - first.x) * ((col-1)/20)) + first.x,
	y: first.y - ((first.y - last.y) * ((row-1)/20))
})


const geographicCoords = []

for(let row = 1; row <= 21; row++) {
	for(let col = 1; col <= 21; col++) {
		if(qrOccupiedModules[row-1].indexOf(col-1) == -1) continue
		const {x, y} = getCoords(col, row)
		console.log({col, row, x: angles(x), y: angles(gd(y))})
		geographicCoords.push({col, row, x: angles(x), y: angles(gd(y))})
	}
	console.log()
}


// (() => {
// 	let data = {}
// 	const reqUrl = apiUrl+'?key='+key+'&radius=35000&idxSet=Geo,POI&limit=20&'
// 	geographicCoords.forEach( ({col, row, x, y}) => {
// 		if(!(col in data)) data[col] = {}
// 		console.log('requesting data')
// 		const results = JSON.parse(request('GET', reqUrl+'&lat='+y+'&lon='+x).body).results
// 		console.log('writing data\n')
// 		data[col][row] = []
// 		results.forEach( result => {
// 			data[col][row].push({
// 				type: result.type,
// 				address: result.address,
// 				position: result.position
// 			})
// 		})
// 		fs.writeFileSync(__dirname + '/mapResultsWithPoi.json', JSON.stringify(data), ()=>{})
// 	})
// })()