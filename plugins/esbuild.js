// npm install esbuild
// then add via:
// import esbuildPlugin from './plugins/esbuild.js'
// eleventyConfig.addPlugin(esbuildPlugin)

import esbuild from 'esbuild';
import path from 'node:path';

const isProduction = process.env.NODE_ENV === 'production';

export default (eleventyConfig) => {
  eleventyConfig.addTemplateFormats('js');

  eleventyConfig.addExtension('js', {
    outputFileExtension: 'js',
    compile: async (content, fullPath) => {
      if (path.basename(fullPath) !== `main.js`) {
        return;
      }

      return async () => {
        let output = await esbuild.build({
          target: 'es2020',
          entryPoints: [fullPath],
          minify: isProduction,
          bundle: true,
          write: false,
          sourcemap: !isProduction,
        });

        return output.outputFiles[0].text;
      };
    },
  });
};
