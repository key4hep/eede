# Making eede aware of new version of EDM4hep

To keep eede up to date with the [EDM4hep](https://github.com/key4hep/EDM4hep)
event data model, we need a way to get the latest information for each datatype
and component. Also, we need to take into account that eede is deployed on
GitHub pages as a static website, so we need a way to update this info without
having a server running.

## How to get the latest information?

There are two commands registered in the `package.json` that can be used to get
the latest information directly from the EDM4hep repository. The first command

```bash
npm run download-model
```

will download the latest data model definition file `edm4hep.yaml` and store it
in the `model/` directory. The second command

```bash
npm run convert-model
```

will generate a file called `datatypes.json` in the `model/` directory, where
all the information is parsed and stored in a format that can be used by the
eede application.

### All at once

You can also run

```bash
npm run update-model
```

to run both commands at once and immediately update the eede application.


## Further improvements

- We could trigger the update process automatically when a new release of
edm4hep is published, but for now, we will keep it simple and run the update
process manually.
- To maintain backward compatibility, we could add a versioning system so we
can later load different versions of the edm4hep data model into eede, however
we currently load the latest version.
