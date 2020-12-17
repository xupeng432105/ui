import * as child_exec from "child_process";
child_exec.exec("npx uglifycss dist/iconfont/iconfont.css > dist/iconfont/iconfont.min.css");
child_exec.exec("npx uglifycss dist/acumin/font-acumin.css > dist/acumin/font-acumin.min.css");
child_exec.exec("del dist/iconfont/iconfont.css");
child_exec.exec("del dist/acumin/font-acumin.css");
