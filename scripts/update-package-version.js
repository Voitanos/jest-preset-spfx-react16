"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
// load package.json file
var packageJson = require('../package.json');
// get arguments for the sha (bbc91a4)
var commit_sha = "" + process.argv[process.argv.length - 1].substr(0, 7);
// update the version of the package.json file (before publishing)
packageJson.version += "-beta." + commit_sha;
console.log('publish version:', packageJson.version);
// save the package.json file (before publishing)
fs.writeFileSync(path.join(path.resolve('.'), 'package.json'), JSON.stringify(packageJson, null, 2));
