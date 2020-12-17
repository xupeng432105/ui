import { deleteFolder } from "./utils";
import * as cp from "child_process";
import * as path from "path";

function getCommand() {
    const cfg = {
        "theme": "minimal",
        "sourcefile-url-prefix": 'https://git-ndp.neulion.net.cn:845/cms/iptv-admin/tree/master/newui/src/',
        "excludePrivate": true,
        "stripInternal": true,
        "out": "docs",
        "inputFiles": ["src/public_api.ts"]
    }
    let segs = [];
    for (let key in cfg) {
        if (cfg.hasOwnProperty(key)) {
            segs.push("--" + key);
            segs.push(cfg[key]);
        }
    }
    return segs;
}
deleteFolder(path.join(__dirname, "docs"));
console.log("exec: " + ['typedoc', ...getCommand()].join(" "));
cp.spawn('npx', ['typedoc', ...getCommand()], {stdio: 'inherit', shell: true})
.on("close", function() {
    if(process.env.NODE_ENV == "local")
    {
        const port = 7453;
        console.log("Start server at: http://localhost:" + port);
        cp.exec(`http-server -p ${port} -c 5 -o ./docs/index.html `);
    }
    
})
