### Setup
- clone repo
- run `npm install`

### File Structure

- Place html files to minify in `/app/`
- Place TypeScript files to compile+ in `/app/ts/`
- Place SCSS files to compile+ in `/app/scss/`. Keep only top-level files in `/scss/` & component .scss files in `/scss/*/`
- Place image files to minify in `/app/images/`
- Place any files to copy over (unchanged) to the distribution directory during builds in `/public/`. The directory structure will be copied - eg: `/public/js/index.js` to `/dist/js/index.js`
- Don't manually place files in `/dist/` as they will be deleted when running the build tasks

### Use

- run `npm run watch` to load the background gulp task runner
- run `npm run build-dev` to execute the gulp task runner & create a development build with debugging capabilities
- run `npm run build` to execute the gulp task runner & create a final compact build
