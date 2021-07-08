# jest-preset-spfx-react16

[![npm @latest](https://img.shields.io/npm/v/@voitanos/jest-preset-spfx-react16/latest?style=flat-square)](https://www.npmjs.com/package/@voitanos/jest-preset-spfx-react16) [![npm @next](https://img.shields.io/npm/v/@voitanos/jest-preset-spfx-react16/next?style=flat-square)](https://www.npmjs.com/package/@voitanos/jest-preset-spfx-react16)

[![Voitanos on Twitter](https://img.shields.io/badge/Twitter-%40voitanos-blue?style=flat-square)](https://www.twitterl.com/voitanos)

A [Jest](http://facebook.github.io/jest) preset configuration for [SharePoint Framework](https://docs.microsoft.com/sharepoint/dev/spfx/sharepoint-framework-overview) (SPFx) projects that leverage React v16. React v16 is used by SPFx projects created with the [SPFx Yeoman generator](https://www.npmjs.com/@microsoft/generator-sharepoint) v1.7.0 or later. It includes the popular [Enzyme](https://airbnb.io/enzyme/) React rendering library from Airbnb

> See the related packages [jest-preset-spfx](https://www.npmjs.com/package/@voitanos/jest-preset-spfx) for SPFx projects without React & [jest-preset-spfx-react15](https://www.npmjs.com/package/@voitanos/jest-preset-spfx-react15) if you are leveraging React v15.

## Installation

1. Install the desired Jest preset using your package manager of choice:

    ```console
    npm install jest @voitanos/jest-preset-spfx-react16 --save-dev
    ```

    This will install `@types/enzyme-adapter-react-16`, `@types/enzyme-to-json`, `@types/jest`, `@types/react-test-renderer`, `enzyme`, `enzyme-adapter-react-16`, `enzyme-to-json`, `identity-obj-proxy`, `jest-junit`, `raf`, `react-test-renderer` & `ts-jest` as dependencies in your project. The specific versions needed for React v16 are used

    The postinstall script will verify you have a `./config/jest.config.json` file and update your `package.json` scripts with two scripts for running Jest tests with this configuration: `test` & `test:watch`.

    If the configuration file is not present, it will create it. If it is present, it will verify the minimal properties.

    > **IMPORTANT**: Make sure you install the version of the preset that matches the version of TypeScript you're using in your project. See [Installing specific preset versions](#installing-specific-preset-versions) for details on how to determine the correct version.

    > **NOTE**: A specific version of `ts-jest` is used to support the SPFx supported version of TypeScript as more current versions of `ts-jest` require newer versions of TypeScript that is not yet supported by SPFx.

1. Install the specified version of Jest for your preset version. See [Installing specific preset versions](#installing-specific-preset-versions) for guidance on picking the correct preset version.

    When the you install the preset, it will output to the console the version of Jest you need to install that the installed version of the **ts-jest** transformer uses. Look for the following statement in the console:

    ```console
    ACTION REQUIRED: Install Jest v25.5.4 by executing the following command in the console:
       npm install jest@25.5.4 --save-dev --save-exact
    ```

    Execute the command displayed in the console to install the required version of Jest in your project.

### Installing specific preset versions

Figuring out the correct matrix of package versions to install can be challenging. This mostly comes down to TypeScript.

SPFx projects are written in TypeScript but Jest defaults to testing JavaScript files. We use the popular [ts-jest](https://www.npmjs.com/package/ts-jest) transformer that converts TypeScript files to JavaScript as Jest executes it's tests. Each version of **ts-jest** is written to match a specific version of TypeScript and Jest.

But no worries! We've done the hard part of figuring out what combinations of versions you need.

#### Determine the TypeScript version of your project

First, determine the version of TypeScript your SPFx project uses:

1. Open the **package.json** file in your SPFx project.
1. Within the `devDependencies` object, look for the package that starts with the name `@microsoft/rush-stack-compiler-`.

    This package is the bridge to a specific version of TypeScript. The TypeScript version is indicated by the last part of the name of the package.

    For example, consider the following entry in the **package.json** file:

    ```json
    {
      ...
      "devDependencies": {
        "@microsoft/rush-stack-compiler-2.9": "0.6.8",
        ...
      }
    }
    ```

    This SPFx project is using **TypeScript v2.9**.

#### Determine the matching Jest preset version

The next step is to determine the corresponding version of the Jest preset that is configured with the version of TypeScript in your project.

The Jest preset NPM package contains distribution tags that are used to alias specific published versions of the package. We use them to indicate which version is built for a specific version of TypeScript.

1. Get a list of all distribution tags by executing the following command:

    ```console
    npm info @voitanos/jest-preset-spfx-react16
    ```

1. Locate the matching TypeScript version. The previous command will write the package information to the console as well as a list of the published distribution tags:

    ```console
    dist-tags:
    latest: 1.2.2             next: 1.3.0-beta.b385582  ts2.9: 1.2.2
    ```

    From this output, you can see three tags:

      - **latest**: the most current stable version of the NPM package that's been published
      - **next**: the next version of the NPM package, usually a beta and used for testing
      - **ts2.9**: the version built for TypeScript v2.9

#### Install a specific Jest preset package version

Using the information above, install the specific Jest preset package:

```console
npm install @voitanos/jest-preset-spfx-react16@1.2.2 --save-dev --save-exact
```

> **NOTE**: Pay close attention to the console output as you'll likely have at least one additional step (*look for ACTION REQUIRED*). The console will also contain information about changes applied to your project to support tests.

## Validating Installation

To validate a successful install, do one of the following two things:

### Option 1: Add example tests

1. Copy the folder **examples** from the installed package (*also found [here in the source repo](https://github.com/Voitanos/jest-preset-spfx-react16/tree/master/examples)*) into the project's **src** folder.
1. Execute Jest to run the tests:

    ```shell
    npm test
    ```

1. Observe five (5) passing tests: one for React rendering, four for non-React Typescript).

### Option 2: Create your own test

1. Add a new file `SampleTests.spec.ts` to the `./src/webparts` folder with the following code:

    ```ts
    import 'jest';

    test('1+1 should equal 2', () => {
      const result = 1+1;
      expect(result).toBe(2);
    });
    ```

1. Execute Jest to run the tests:

    ```shell
    npm test
    ```

1. Observe a single (1) passing test.

## How it works

This package contains a [base Jest configuration](https://github.com/Voitanos/jest-preset-spfx-react16/blob/master/jest-preset.json) that your project will inherit. It does this by using the `preset` property in the `jest.config.json` file.

## References

### Package.json NPM scripts

Two scripts are added to the `package.json` scripts section:

- **test**: Run Jest and specify the configuration file to use: `npm test`.
- **test:watch**: Run Jest and specify the configuration file to use, but run in watch mode so when files change, it will automatically re-run the tests: `npm run test:watch`.

### Jest preset configuration for SPFx

The following preset is used for SPFx projects:

```json
{
  "collectCoverage": true,
  "coverageDirectory": "<rootDir>/../temp/test",
  "coverageReporters": [
    "json",
    "lcov",
    "text-summary"
  ],
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "json"
  ],
  "moduleNameMapper": {
    "\\.(css|scss)$": "identity-obj-proxy",
    "^resx-strings/en-us.json": "<rootDir>/node_modules/@microsoft/sp-core-library/lib/resx-strings/en-us.json"
  },
  "setupFiles": [
    "raf/polyfill",
    "@voitanos/jest-preset-spfx-react16/jest.enzyme.js"
  ],
  "snapshotSerializers": [
    "enzyme-to-json/serializer"
  ],
  "testMatch": [
    "**/src/**/*.(spec|test).+(ts|js)?(x)",
    "**/__tests__/**/*.(spec|test).+(ts|js)?(x)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
}
```

Explanation of select configuration properties above:

- **collectCoverage**: collects code coverage statistics and generates associated reports in the `./temp/test` folder
- **moduleNameMapper**:
  - when Jest sees a request for a CSS/SCSS file in the source files, it effectively ignores it using the `identity-obj-proxy` package
  - when jest sees a request for `en-us.json`, it is provided a helper path to find the file
- **setupFiles**:
  - installs the **requestAnimationFrames** polyfill needed for headless browser testing
  - configures Enzyme to use the React v16 adapter
- **testMatch**: all tests found either in a special `__tests__` folder or within the `src` folder with the following names will be found:
  - `*.spec.ts`
  - `*.spec.tsx`
  - `*.spec.js`
  - `*.spec.jsx`
  - `*.test.ts`
  - `*.test.tsx`
  - `*.test.js`
  - `*.test.jsx`
- **transform**: the Jest preprocessor will transpile all TypeScript files to JavaScript before running the tests
