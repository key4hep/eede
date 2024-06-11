# Keeping dmx up to date

To keep dmx up to date with the event data model [edm4hep](https://github.com/key4hep/EDM4hep), we need a way to get the latest information for each datatype and component. Also, we need to take into account that dmx is deployed on github pages as a static website, so we need a way to update this info without having a server running.

## How to get the latest information?

In the root directory, there are two commands in `package-json` that can be used to get the latest information from the edm4hep repository. The first command

```bash
npm run download
```

will download the latest information from the edm4hep, by using the file called `edm4hep.yaml` under `model` directory, containg up to date information about `edm4hep`. The second command

```bash
npm run build
```

will generate a file called `datatypes.js` under `output` directory, where all the information is parsed and stored in a format that can be used by the dmx application.

## All at once

You can also run

```bash
npm run update
```

to run both processes at once and inmediatly update the dmx application.

## Further improvements

-   We could trigger the update process automatically when a new release of edm4hep is published, but for now, we will keep it simple and run the update process manually.
-   To maitain backward compatibility, we could add a versioning system so we can later load different versions of the edm4hep data model into dmx, however we currrently load the latest version.
