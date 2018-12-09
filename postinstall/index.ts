#!/usr/bin/env node

/*
* if jest.config.json not present, add it
* update package.json with new test script
*/

import * as fs from 'fs';
import * as path from 'path';

const CURR_DIR = path.resolve(__dirname);
// split directory path (non-windows)
let nestedDirs = CURR_DIR.split("/");
// split directory path (windows)
if (nestedDirs.length <= 1) {
  nestedDirs = CURR_DIR.split("\\");
}

// verify path
if (nestedDirs.length === 0) {
  console.error('ERROR: unexpected install path.')
}
// find the node_modules folder
const nmIndex = nestedDirs.indexOf('node_modules');
// verify node_modules found & get the path to one level up...
//  this should be the project root
if (nmIndex === -1) {
  console.error('ERROR: expected folder \'node_modules\' not found.');
}
const nest = nestedDirs.slice(nmIndex);
if (!nest || nest.length ===0){
  console.error('ERROR: unexpected install path.')
}
const paths = nest.map(m => "..");
const projectPath = path.resolve(path.join(__dirname, paths.join('/')));

/**
 * 
 * STEP 1: JEST CONFIG FILE
 * 
 */
console.log("INFO: Adding Jest configuration file to: ./config/jest.config.json");

const jestConfigFilePath = path.resolve(path.join(projectPath, 'config', 'jest.config.json'));
// check if jest config file present
if (fs.existsSync(jestConfigFilePath)) {
  console.log('      .. jest.config.json exists... verifying properties');
  // exists, check the properties are correct
  const jestConfigFile: any = require(jestConfigFilePath);
  if (!jestConfigFile.preset || jestConfigFile.preset !== '@voitanos/jest-preset-spfx-react16') {
    console.warn('ACTION REQUIRED: ensure jest.config.json has "preset": "@voitanos/jest-preset-spfx-react16"');
  }
  if (!jestConfigFile.rootDir || jestConfigFile.rootDir !== '../src') {
    console.warn('ACTION REQUIRED: ensure jest.config.json has "rootDir": "../src"');
  }
} else {
  // doesn't exist, so copy it in
  console.log('INFO: jest.config.json not found; creating it');
  
  // get path to sample file
  const jestConfigTemplate = path.join(CURR_DIR, '..', 'resources', 'jest.config.json');
  // copy file in
  fs.copyFileSync(jestConfigTemplate, jestConfigFilePath);
}


/**
 * 
 * STEP 2: PACKAGE.JSON
 * Check scripts.test property
 * 
 */
console.log("INFO: Updating NPM script 'test' to use Jest.");

const packageFilePath = path.resolve(path.join(projectPath, 'package.json'));

// check setting on package.json/scripts/test
const packageFile: any = require(packageFilePath);
if (!packageFile.scripts || !packageFile.scripts.test || packageFile.scripts.test === 'gulp test') {
  console.log('INFO" package.json script/test currently set to default SPFx project; updating to use jest');

  // new script settings:
  const jestTestScripts: any = {
    "test": "./node_modules/.bin/jest --config ./config/jest.config.json",
    "test:watch": "./node_modules/.bin/jest --config ./config/jest.config.json --watchAll",
  }

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