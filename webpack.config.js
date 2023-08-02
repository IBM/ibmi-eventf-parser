/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-nocheck

'use strict';

const withDefaults = require(`./shared.webpack.config`);
const path = require(`path`);
const webpack = require(`webpack`);

module.exports = withDefaults({
  context: path.join(__dirname),
  resolve: {
    // Add `.ts` as a resolvable extension.
    extensions: [".ts", ".js"],
    // Add support for TypeScripts fully qualified ESM imports.
    extensionAlias: {
      ".js": [".js", ".ts"],
      ".cjs": [".cjs", ".cts"],
      ".mjs": [".mjs", ".mts"]
    }
  },
  module: {
    rules: [
      // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.([cm]?ts|tsx)$/, loader: "ts-loader", options: {allowTsInNodeModules: true} }
    ]
  },
  entry: {
    extension: `./src/index.ts`,
  },
  output: {
    filename: path.join(`index.js`),
    path: path.join(__dirname, `dist`)
  }
});