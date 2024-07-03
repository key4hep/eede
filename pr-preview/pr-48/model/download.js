import https from "https";
import fs from "fs";

const URL =
  "https://raw.githubusercontent.com/key4hep/EDM4hep/main/edm4hep.yaml";

const folder = process.argv[2] ?? "model";

const file = fs.createWriteStream(`${folder}/edm4hep.yaml`);
https.get(URL, (res) => {
  res.pipe(file);

  file.on("finish", () => {
    file.close();
    console.log("Download completed");
  });
});
