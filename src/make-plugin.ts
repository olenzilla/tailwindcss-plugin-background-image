import plugin from 'tailwindcss/plugin'
import { GlobOptions, globSync } from 'glob'
import { CSSRuleObject } from 'tailwindcss/types/config'

export default function makePlugin({
	globOptionsByPattern = {
		'./src/**/*.@(jpg|jpeg|png|gif|svg|webp)': { dot: true },
	} as Record<string, GlobOptions>,
	makeStyle = function (
		imagePath: string,
	): { backgroundImage: `url(${string})` } & Record<string, string> {
		return { backgroundImage: `url('${imagePath}')` }
	},
	makeUtilityWithExtension = function (imagePath: string): string {
		return imagePath.replace(/^src/, '')
	} as ((imagePath: string) => string) | void | null | false,
	makeUtilityWithoutExtension = function (imagePath: string): string {
		return imagePath.replace(/^src|\.\w+$/g, '')
	} as ((imagePath: string) => string) | void | null | false,
	utilityPrefix = 'bg-' as string | void | null | false,
} = {}) {
	return plugin(function ({ addUtilities, e }) {
		Object.entries(globOptionsByPattern).forEach(([pattern, globOptions]) => {
			const imagePaths = globSync(pattern, globOptions)
			const utilities = imagePaths
				.flatMap((imagePath) => {
          const style = typeof imagePath == 'string' && makeStyle?.(imagePath)
					if (style) {
						const withExtension = makeUtilityWithExtension && makeUtilityWithExtension?.(imagePath)
						const withoutExtension = makeUtilityWithoutExtension && makeUtilityWithoutExtension?.(imagePath)
						return filterBoolean([withExtension, withoutExtension])
							.map(
								(utility) =>
									[`.${utilityPrefix || ''}${e(utility)}`, style] as const,
							)
					} else {
						return []
					}
				})
				.reduce(
					(acc, [key, value]) => Object.assign(acc, { [key]: value }),
					{} as CSSRuleObject,
				)
			addUtilities(utilities)
		})
	})
}

function filterBoolean<T>(arr: T[]) {
  return arr.filter(Boolean) as Exclude<T, void | null | false | '' | 0>[]
}
