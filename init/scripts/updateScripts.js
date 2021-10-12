const scripts = require("./package-scripts");

const getCmds = (pScripts, cmds, parentKeys = "") => {
  Object.keys(pScripts).forEach((key) => {
    try {
      const row = pScripts[key];
      if (key === "description") {
        return;
      }
      if (row.description || typeof row === "string") {
        const path = (parentKeys + key).replace(".default", "");
        // const scriptName = row.description ? path+" *":path;
        const scriptName = path;
        cmds[scriptName] = "nps " + path;
        console.log("`"+cmds[scriptName]+"`\n");
        if (row.description)
          console.log("*"+row.description+"*\n");
      } else {
        getCmds(row, cmds, parentKeys + key + ".");
      }
    } catch (error) {
      console.log("key: ", key, ", row:", pScripts[key], ", pScripts: ", pScripts);
      console.error(error);
    }
  });
};
const newScripts = {
  "help": "nps ",
  "update_scripts": "node scripts/updateScripts.js",
};
getCmds(scripts.scripts, newScripts);
console.log("scripts: ", newScripts);

const pjson = require("../package.json");
pjson.scripts = newScripts;

// console.log(JSON.stringify(pjson, null, 2));
const fs = require("fs");
fs.writeFileSync("./package.json", JSON.stringify(pjson, null, 2));
console.log("write " + Object.keys(newScripts).length + " cmds to package.json");

