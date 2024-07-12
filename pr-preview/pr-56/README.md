# eede
*EDM4hep Event Data Explorer*

Warning: **Experimental**

Explore your events at [eede](https://key4hep.github.io/eede/).

To generate your `.json` file use `edm4hep2json` available in the Key4hep stack.
Example usage for the events from FCC `winter2023` campaign:
```
source /cvmfs/sw.hsf.org/key4hep/setup.sh
edm4hep2json -l Particle \
             -n 10 \
             -o p8_ee_WW_ecm240.json \
             /eos/experiment/fcc/ee/generation/DelphesEvents/winter2023/IDEA/p8_ee_WW_ecm240/events_059793334.root
```


## Development

The tool is written in pure JS and draws on HTML Cavas.
To run a local version, clone the repo and create simple web server:
```bash
python -m http.server
```
after that visit localhost (`http://0.0.0.0:8000/`) in your browser.

## ToDo

* Filters:
  * generator status
  * generation
  * ancestor
* Event switcher
* Status box
* Details box
