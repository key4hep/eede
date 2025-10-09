# eede

*EDM4hep Event Data Explorer*

Explore the structure of the EDM4hep events using
[eede](https://key4hep.github.io/eede/)!

To generate your JSON file from the EDM4hep ROOT file use `edm4hep2json`,
available in the
[Key4hep stack](https://key4hep.github.io/key4hep-doc/getting_started/setup.html).

> Example usage for the events from the
> [FCC `winter2023`](https://fcc-physics-events.web.cern.ch/fcc-ee/delphes/winter2023/)
> campaign:
> ```
> source /cvmfs/sw.hsf.org/key4hep/setup.sh
> edm4hep2json -l Particle \
>              -n 10 \
>              -o p8_ee_WW_ecm240.json \
>              /eos/experiment/fcc/ee/generation/DelphesEvents/winter2023/IDEA/p8_ee_WW_ecm240/events_059793334.root
> ```


## Running locally

This is [Node.js](https://nodejs.org/en) based project, where the graphics part
is written using the [PixiJS](https://github.com/pixijs/pixijs) engine.

To run the local version of the project, clone the repository
```sh
git clone https://github.com/key4hep/eede.git
```
install the packages:
```sh
npm install
```
and start the local server:
```sh
npm run serve
```
afterwards visit [http://127.0.0.1:8008/](http://127.0.0.1:8008/) in your web
browser.
