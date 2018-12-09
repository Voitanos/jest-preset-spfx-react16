#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
 * STEP 1: JEST + ENZYME SETUP FILE
 *
 */
// console.log("INFO: Adding Jest & Enzyme setup file to: ./config/jest.enzyme.js");
// const jestEnzymeFilePath = path.resolve(path.join(projectPath, 'config', 'jest.enzyme.js'));
// // check if file present
// if (fs.existsSync(jestEnzymeFilePath)) {
//   console.log('      .. jest.enzyme.js exists');
// } else {
//   // doesn't exist, so copy it in
//   console.log('INFO: jest.enzyme.js not found; creating it');
//   // get path to sample file
//   const jestConfigTemplate = path.join(CURR_DIR, '..', 'resources', 'jest.config.json');
//   // copy file in
//   fs.copyFileSync(jestConfigTemplate, jestConfigFilePath);
// }
/**
 *
 * STEP 2: JEST CONFIG FILE
 *
 */
console.log("INFO: Adding Jest configuration file to: ./config/jest.config.json");
var jestConfigFilePath = path.resolve(path.join(projectPath, 'config', 'jest.config.json'));
// check if jest config file present
if (fs.existsSync(jestConfigFilePath)) {
    console.log('      .. jest.config.json exists... verifying properties');
    // exists, check the properties are correct
    var jestConfigFile = require(jestConfigFilePath);
    if (!jestConfigFile.preset || jestConfigFile.preset !== 'jest-preset-spfx') {
        console.warn('ACTION REQUIRED: ensure jest.config.json has "preset": "jest-preset-spfx"');
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
 * STEP 3: PACKAGE.JSON
 * Check scripts.test property
 *
 */
console.log("INFO: Updating NPM script 'test' to use Jest.");
var packageFilePath = path.resolve(path.join(projectPath, 'package.json'));
// check setting on package.json/scripts/test
var packageFile = require(packageFilePath);
if (!packageFile.scripts || !packageFile.scripts.test || packageFile.scripts.test === 'gulp test') {
    console.log('INFO" package.json script/test currently set to default SPFx project; updating to use jest');
    // new script settings:
    var jestTestScripts = {
        "test": "./node_modules/.bin/jest --config ./config/jest.config.json",
        "test:watch": "./node_modules/.bin/jest --config ./config/jest.config.json --watchAll",
    };
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
