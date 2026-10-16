const { argv } = require('node:process');
const https = require('node:https');
const fs = require('node:fs');
const jsYaml = require('js-yaml');

const URL =
  "https://raw.githubusercontent.com/key4hep/EDM4hep/main/edm4hep.yaml";

const outFolder = argv[2] ?? "model";
const outFilePathTmp = (oDir, sVer) => `${oDir}/edm4hep_${sVer}.yaml`;
const tmpFilePath = `/tmp/edm4hep.yaml`;

console.log('Downloading EDM4hep YAML definition file...');

function move() {
  console.log('Determining schema version of the dowloaded file...')

  const fileData = fs.readFileSync(tmpFilePath,
                                   { encoding: 'utf8', flag: 'r' });
  const yamlData = jsYaml.load(fileData);
  const schemaVersion = yamlData['schema_version'];

  console.log(`Found schema version: ${schemaVersion}`);

  fs.copyFile(tmpFilePath, outFilePathTmp(outFolder, schemaVersion), function (err) {
    if (err) {
      throw err;
    } else {
      console.log(`File saved to: ${outFilePathTmp(outFolder, schemaVersion)}`);
      fs.unlink(tmpFilePath, (err) => {
        if (err) throw err;
      });
    }
  });
}


const writeStream = fs.createWriteStream(tmpFilePath,
                                         { encoding: 'utf8', flag: 'w' });

https.get(URL, (res) => {
  res.pipe(writeStream);

  writeStream.on("finish", () => {
    writeStream.close(() => {
      console.log("Download completed!");
      move();
    });
  });
}).on('error', (err) => {
  fs.unlink(tmpFilePath, () => {
    console.error('Error occured when downloading the file:\n', err);
  });
});
