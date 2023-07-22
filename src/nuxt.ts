import makePlugin from './make-plugin'

module.exports = makePlugin({
	globOptionsByPattern: {
		'./assets/**/*.@(jpg|jpeg|png|gif|svg|webp)': { dot: true },
	},
	makeStyle(imagePath) {
		return { backgroundImage: `url('~/${imagePath}')` }
	},
	makeUtilityWithExtension(imagePath) {
		return imagePath.replace(/^assets[\/\\]/, '')
	},
	makeUtilityWithoutExtension(imagePath) {
		return imagePath.replace(/^assets[\/\\]|\.\w+$/g, '')
	},
})
