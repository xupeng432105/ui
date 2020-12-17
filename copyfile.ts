import { copyFileSync, copyFolderSync } from "./utils";

//copyFileSync("dist/newui.js", "../iptv-admin-portal/WebContent/scripts/common");
copyFileSync("dist/newui.min.js", "../iptv-admin-portal/WebContent/scripts/common");
copyFileSync("dist/newui.css", "../iptv-admin-portal/WebContent/styles/common");
copyFolderSync("dist/acumin", "../iptv-admin-portal/WebContent/styles/fonts/acumin");
copyFolderSync("dist/iconfont", "../iptv-admin-portal/WebContent/styles/fonts/iconfont");