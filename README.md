[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# tailwindcss-plugin-background-image

A Tailwind plugin that generates background-image TailwindCSS utilities from glob'd pattern of image files.

**Headline: when used in combination with Prettier and [`prettier-plugin-tailwindcss`](https://www.npmjs.com/package/prettier-plugin-tailwindcss), this allows you to have autocompletion for the `bg-*` classes this plugin creates.**

## Basic Usage

This will use all default options:
* Find and create all images under `src`
* Create a Tailwind utility classes for each image with, and without, their respective file extensions. For example:
  * `src/something.png` means you can use `class="bg-something"` or `class="bg-something.png"` in your HTML templates.
  * Those tailwind utilities will be styled as `background-image: url('src/something.png');`
* Because these are just Tailwind utilities:
  * You can use any variants enabled in your Tailwind config. For example:
    * With images `src/home-mobile.jpg` and `src/home-desktop.jpg`,
    * You can use `class="bg-home-mobile md:bg-home-desktop"` to style a responsive home background image.
  * By using Prettier and [`prettier-plugin-tailwindcss`](https://www.npmjs.com/package/prettier-plugin-tailwindcss), you will have autocomplete for all the `bg-*` Tailwind utilities this plugin creates.

**Contents of `tailwind.config.js`:**
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
	// ...
	plugins: [
		require('@olenzilla/tailwindcss-plugin-background-image'),
		// ...
	],
}
```

## Basic Nuxt Usage

If you're using Tailwind in a [Nuxt](https://nuxtjs.org/) project, use `'@olenzilla/tailwindcss-plugin-background-image/nuxt'` in your `tailwind.config.js`. It is setup to assume you're using the `assets` folder for images, and uses a `background-image` expression of `url('~/...')` for the images there.

**Contents of `tailwind.config.js`:**
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
	// ...
	plugins: [
		require('@olenzilla/tailwindcss-plugin-background-image/nuxt'),
		// ...
	],
}
```

## Advanced Usage

You can use:
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
	// ...
	plugins: [
		require('@olenzilla/tailwindcss-plugin-background-image/make-plugin').default({
			// ...
		}),
		// ...
	],
}
```

With any of the following options, to customize any aspect of this plugin for your particular project:

## `makePlugin` Options

### `globOptionsByPattern`
Object whose keys are glob patterns, and whose values are the corresponding [GlobOptions](https://github.com/isaacs/node-glob/blob/main/README.md#options)> for that glob pattern. Default:

```
{ './src/**/*.@(jpg|jpeg|png|gif|svg|webp)': { dot: true } }
```

### makeStyle
Type: `function(imagePath: string): {backgroundImage: string}` or `false`/`null`/`undefined`

A function that takes the path of each image retrieved by the glob(s), and returns a dictionary for the `background-image` style of the created Tailwind utility. Or, if falsy, no utility will be created for that image. Default:
```
(image) => ({ backgroundImage: `url('${image}')` })
```

### makeUtilityWithExtension
Type: ```function(imagePath: string): string | false | null | undefined``` or `false`/`null`/`undefined`

A function that takes the path of each image retrieved by the glob(s), and returns the name of the Tailwind utility to be created _with_ the image's extension (to disambiguate it from another image with the same name but different extension). Or, if falsy, no utility will be created for image _with_ its extension. Default:

```
(image) => image.replace(/^src/, '')
```

### makeUtilityWithoutExtension
Type: ```function(imagePath: string): string | false | null | undefined``` or `false`/`null`/`undefined`

A function that takes the path of each image retrieved by the glob(s), and returns the name of the Tailwind utility to be created _without_ the image's extension. Or, if falsy, no utility will be created for image _without_ the image's extension. Default:

```
(image) => image.replace(/^src|\.\w+$/g, '')
```

### utilityPrefix
Type: ```string | false | null | undefined```

The string to be added as the prefix for all the utilities created by this plugin.

Default: `'bg-'`
