// This is a basic configuration to use CSS preprocessing in Eleventy
// npm install browserslist lightningcss
// then add to your main config via:
// 
// import lightningCssPlugin from './plugins/lightning-css.js'
// eleventyConfig.addPlugin(lightningCssPlugin)

// kudos to Stephanie Eckles: https://11ty.rocks/posts/process-css-with-lightningcss/

import path from 'node:path';
import browserslist from 'browserslist';
import {
  bundle,
  browserslistToTargets,
} from 'lightningcss';

export default (eleventyConfig) => {
  eleventyConfig.addTemplateFormats('css');

  // Process CSS with LightningCSS
  eleventyConfig.addExtension('css', {
    outputFileExtension: 'css',
    compile: async function (_inputContent, inputPath) {
      let parsed = path.parse(inputPath);
      if (parsed.name.startsWith('_')) {
        return;
      }

      let targets = browserslistToTargets(browserslist('> 0.2% and not dead'));

      return async () => {
        // Switch to the `transform` function if you don't
        // plan to use `@import` to merge files
        let { code } = await bundle({
          filename: inputPath,
          minify: true,
          sourceMap: false,
          targets,
          // Supports CSS nesting
          drafts: {
            nesting: true,
          },
        });
        return code;
      };
    },
  });
};
