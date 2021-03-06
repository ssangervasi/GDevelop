/**
 * Launch this script to re-generate all the web-app examples (stored in src/fixtures)
 * from the examples in resources/examples. All resource paths are updated to be URLs,
 * using the same base URL (specified below in the script).
 */
const initializeGDevelopJs = require('../public/libGD.js');
const {
  readProjectFile,
  loadSerializedProject,
} = require('./lib/LocalProjectOpener');
const { writeProjectJSONFile } = require('./lib/LocalProjectWriter');
const makeExtensionsLoader = require('./lib/LocalJsExtensionsLoader');
const { getExampleNames } = require('./lib/ExamplesLoader');
const fs = require('fs').promises;
var shell = require('shelljs');

// The base URL where all resources of web-app examples are stored.
const baseUrl = 'https://resources.gdevelop-app.com/examples';

const writeInternalExampleFilesJsFile = exampleNames => {
  let importsCode = [];
  let internalFilesObjectCode = [];
  exampleNames.forEach((exampleName, index) => {
    importsCode.push(
      `import exampleFile${index} from '../../fixtures/${exampleName}/${exampleName}.json';`
    );
    internalFilesObjectCode.push(
      `  'example://${exampleName}': exampleFile${index},`
    );
  });

  const content = [
    `// @flow`,
    `// This file is generated by update-fixtures-from-resources-examples.js script`,
    ``,
    importsCode.join('\n'),
    ``,
    `// prettier-ignore`,
    `export default {`,
    internalFilesObjectCode.join('\n'),
    `};`,
    ``,
  ].join('\n');

  return fs.writeFile(
    '../src/ProjectsStorage/InternalFileStorageProvider/InternalExampleFiles.js',
    content,
    'utf8'
  );
};

initializeGDevelopJs().then(async gd => {
  const updateResources = (project, baseUrl) => {
    const worker = new gd.ArbitraryResourceWorkerJS();
    worker.exposeImage = file => {
      // Don't do anything
      return file;
    };
    worker.exposeShader = shader => {
      // Don't do anything
      return shader;
    };
    worker.exposeFile = file => {
      if (file.length === 0) return '';

      console.log('Updating resource: ', file);
      return baseUrl + '/' + file;
    };

    project.exposeResources(worker);
  };

  const noopTranslationFunction = str => str;

  const loadingResults = await makeExtensionsLoader({
    gd,
    filterExamples: false,
  }).loadAllExtensions(noopTranslationFunction);

  console.info('Loaded extensions', loadingResults);

  const exampleNames = await getExampleNames();
  const exampleErrors = {};
  await Promise.all(
    exampleNames.map(async exampleName => {
      try {
        const projectObject = await readProjectFile(
          `../resources/examples/${exampleName}/${exampleName}.json`
        );
        console.log(`Example "${exampleName}" loaded.`);
        const project = loadSerializedProject(gd, projectObject);
        updateResources(project, baseUrl + '/' + exampleName);

        await fs.mkdir(`../src/fixtures/${exampleName}`, { recursive: true });
        await writeProjectJSONFile(
          gd,
          project,
          `../src/fixtures/${exampleName}/${exampleName}.json`
        );

        console.log(`Update of "${exampleName}" done.`);
      } catch (error) {
        console.error(`❌ Error caught for ${exampleName}:`, error);
        exampleErrors[exampleName] = error;
      }
    })
  );

  try {
    await writeInternalExampleFilesJsFile(exampleNames);
  } catch (error) {
    console.error(
      `❌ Error caught while writing InternalExampleFiles.js:`,
      error
    );
    shell.exit(1);
  }

  const erroredExampleNames = Object.keys(exampleErrors);
  if (erroredExampleNames.length) {
    console.error(
      `❌ InternalExampleFiles.js written, but some examples had errors:`,
      exampleErrors
    );
    shell.exit(1);
  }
  console.error(`✅ InternalExampleFiles.js written.`);
});
