#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.IS_BUILD) {
    console.log('skipping POSTINSTALL script');
    process.exit(0);
}
/*
* if jest.config.json not present, add it
* update package.json with new test script
*/
var fs = require("fs");
var path = require("path");
var CURR_DIR = path.resolve(__dirname);
// split directory path (non-windows)
var nestedDirs = CURR_DIR.split("/");
// split directory path (windows)
if (nestedDirs.length <= 1) {
    nestedDirs = CURR_DIR.split("\\");
}
// verify path
if (nestedDirs.length === 0) {
    console.error('ERROR: unexpected install path.');
}
// find the node_modules folder
var nmIndex = nestedDirs.indexOf('node_modules');
// verify node_modules found & get the path to one level up...
//  this should be the project root
if (nmIndex === -1) {
    console.error('ERROR: expected folder \'node_modules\' not found.');
}
var nest = nestedDirs.slice(nmIndex);
if (!nest || nest.length === 0) {
    console.error('ERROR: unexpected install path.');
}
var paths = nest.map(function (m) { return ".."; });
var projectPath = path.resolve(path.join(__dirname, paths.join('/')));
/**
 *
 * STEP 1: JEST CONFIG FILE
 *
 */
console.log('JEST PRESET POSTINSTALL STEP 1 of 4...');
console.log('INFO: Adding Jest configuration file to: ./config/jest.config.json');
var jestConfigFilePath = path.resolve(path.join(projectPath, 'config', 'jest.config.json'));
// check if jest config file present
if (fs.existsSync(jestConfigFilePath)) {
    console.log('      .. jest.config.json exists... verifying properties');
    // exists, check the properties are correct
    var jestConfigFile = require(jestConfigFilePath);
    if (!jestConfigFile.preset || jestConfigFile.preset !== '@voitanos/jest-preset-spfx') {
        console.warn('ACTION REQUIRED: ensure jest.config.json has "preset": "@voitanos/jest-preset-spfx"');
    }
    if (!jestConfigFile.rootDir || jestConfigFile.rootDir !== '../src') {
        console.warn('ACTION REQUIRED: ensure jest.config.json has "rootDir": "../src"');
    }
}
else {
    // doesn't exist, so copy it in
    console.log('INFO: jest.config.json not found; creating it');
    // get path to sample file
    var jestConfigTemplate = path.join(CURR_DIR, '..', 'resources', 'jest.config.json');
    // copy file in
    fs.copyFileSync(jestConfigTemplate, jestConfigFilePath);
}
/**
 *
 * STEP 2: PACKAGE.JSON
 * Check scripts.test property
 *
 */
console.log('JEST PRESET POSTINSTALL STEP 2 of 4...');
console.log('INFO: Updating NPM script \'test\' to use Jest.');
var packageFilePath = path.resolve(path.join(projectPath, 'package.json'));
// check setting on package.json/scripts/test
var packageFile = require(packageFilePath);
if (!packageFile.scripts || !packageFile.scripts.test || packageFile.scripts.test === 'gulp test') {
    console.log('INFO" package.json script/test currently set to default SPFx project; updating to use jest');
    /** update package.json */
    // remove current test
    delete packageFile.scripts.test;
    // add both new scripts
    packageFile.scripts["test"] = "./node_modules/.bin/jest --config ./config/jest.config.json";
    packageFile.scripts["test:watch"] = "./node_modules/.bin/jest --config ./config/jest.config.json --watchAll";
    // save it
    fs.writeFileSync(packageFilePath, JSON.stringify(packageFile, null, 2));
    console.log('INFO: package.json scripts updated for Jest testing');
    console.log('     .. run "npm test" or "npm test:watch" to run Jest tests');
}
/**
 *
 * STEP 2: TSCONFIG.JSON
 * Verify @types/jest is present in tsconfig include
 *
 */
console.log('JEST PRESET POSTINSTALL STEP 3 of 4...');
console.log('INFO: Ensure tsconfig.json includes \'@types/jest\' in the `types` property');
var tsconfigFilePath = path.resolve(path.join(projectPath, 'tsconfig.json'));
// check if @types/jest is present in includes
var tsconfigFile = require(tsconfigFilePath);
if (!tsconfigFile.compilerOptions.types.includes('@types/jest')) {
    console.log('      .. Jest type declarations not present...');
    // add it
    tsconfigFile.compilerOptions.types.push('@types/jest');
    // save it
    fs.writeFileSync(tsconfigFilePath, JSON.stringify(tsconfigFile, null, 2));
    console.log('INFO: tsconfig.json updated to include Jest type declarations');
}
/**
 *
 * STEP 4: Install JEST
 * Install the correct version of JEST
 *
 */
console.log('JEST PRESET POSTINSTALL STEP 4 of 4...');
var thisPackageFile = require('../package.json');
var jestVersion = thisPackageFile.peerDependencies.jest;
console.log("ACTION REQUIRED: Install Jest v" + jestVersion + " by executing the following command in the console:");
console.log("      npm install jest@" + jestVersion + " --save-dev --save-exact");
