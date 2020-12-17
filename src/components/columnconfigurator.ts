import { cookie, isFunction, mergeCfg } from "../utils";
import { EsCheckbox } from "./checkbox";
import { EsDropdownLayerComponent } from "./dropdownlayer";

/**
 * To create a column configuration component for table, used in CMS program list page
*/
export class EsColumnConfigurator {
    cfg: ColumnConfiguratorCfg;
    $rootElement: JQuery;
    popupComponent: EsDropdownLayerComponent;
    constructor(cfg: ColumnConfiguratorCfg) {
        this.init(cfg);
    }
    init(cfg: ColumnConfiguratorCfg) {
        this.mergeConfig(cfg);
        this.createStage();
        this.createIcons();
        this.bindPopupComp(this.createDropdown());
    }
    mergeConfig(cfg: ColumnConfiguratorCfg) {
        let defaultCfg = {
            cookieName: "",
            cookiePath: "",
            container: "",
            title: "Choose columns to display",
            maxAllowCheckedCount: 8,
            options: [{
                name: "",
                text: "",
                required: "false",
                checked: "true"
            }],
            onsave: function (options) { },
            onchange: function (options) { }
        };
        this.cfg = mergeCfg(defaultCfg, cfg);
    }
    createStage() {
        $(this.cfg.container).append('<div class="es-columns"></div>');
        this.$rootElement = $(this.cfg.container).find(".es-columns");
    }
    createIcons() {
        let self = this;
        this.$rootElement.append('<button class="button-bordered es-columns-button" title="' + this.cfg.title + '">\
                <span class="iconfont icon-column"></span>\
                <span class="iconfont icon-ag-d es-columns-arrow-down"></span>\
            </button>');

        this.$rootElement.find(".es-columns-button").on("click", function () {
            self.popupComponent.show(self.createDropdown());
        });
    }
    createDropdown() {
        let checkedCount = this.getCheckedCount();
        let str = "";
        str += '<div class="es-columns-dropdown">';
        str += '<div class="es-columns-dropdown-title">' + this.cfg.title + ' <span class="es-columns-dropdown-info">(' + '<span class="es-columns-dropdown-info-checked">' + checkedCount + '</span>' + '/' + this.cfg.maxAllowCheckedCount + '</span>)</div>';
        str += '<ul class="es-columns-dropdown-list">';
        for (let i = 0; i < this.cfg.options.length; i++) {
            let opt = this.cfg.options[i];
            let requiredStr = opt["required"] == 'true' ? "disabled" : "";
            let checkedStr = opt["required"] == 'true' ? "checked" : (opt["checked"] == "true") ? "checked" : "";
            str += '<li class="es-columns-dropdown-list-options" title="' + (opt["required"] == 'true' ? "This column should not be hide" : "") + '">\
                        <label>\
                            <input type="checkbox" class="es-checkbox" ' + requiredStr + ' ' + checkedStr + '  name="showColumns_' + opt["name"] + '"/>\
                            '+ opt["text"] + '\
                        </label>\
                    </li>';
        }
        str += '</ul>';
        str += "</div>"
        return str;

    }
    bindPopupComp(content) {
        let self = this;
        this.popupComponent = new EsDropdownLayerComponent({
            targetElement: this.$rootElement[0],
            content: content,
            onShow: function () {
                EsCheckbox.initAll();
                self.checkMax();
                self.$rootElement.find(".es-checkbox").on("change", function () {
                    let i = $(this).parents(".es-columns-dropdown-options").index();
                    let checkboxName = $(this).attr("name").split("_")[1];
                    let settingItem;
                    let checkedCount;
                    for (let m = 0; m < self.cfg.options.length; m++) {
                        if (self.cfg.options[m].name == checkboxName) {
                            settingItem = self.cfg.options[m];
                            break;
                        }
                    }
                    if ($(this).is(":checked")) {
                        settingItem["checked"] = "true";
                    }
                    else {
                        settingItem["checked"] = "false";
                    }
                    checkedCount = self.getCheckedCount();
                    self.$rootElement.find(".es-columns-dropdown-info-checked").html(checkedCount);
                    self.checkMax();
                    self.saveToCookie();
                    if (isFunction(self.cfg.onchange)) {
                        self.cfg.onchange(self.cfg.options);
                    }
                });
            }
        });
    }
    getCheckedCount() {
        let checkedCount = 0;
        for (let m = 0; m < this.cfg.options.length; m++) {
            if (this.cfg.options[m].checked == "true") {
                checkedCount++;
            }
        }
        return checkedCount;
    }
    checkMax() {
        let self = this;
        let checkedCount = self.getCheckedCount();
        let $ele;
        if (checkedCount >= self.cfg.maxAllowCheckedCount) {
            self.$rootElement.find(".es-columns-dropdown-info-checked").addClass("warning");
            for (let k = 0; k < self.cfg.options.length; k++) {
                if (self.cfg.options[k].checked == "false") {
                    $ele = self.$rootElement.find(".es-columns-dropdown-list-options").eq(k);
                    $ele.attr("data-oldtitle", $ele.attr("title") || "").attr("title", "Too many displayed columns, please uncheck some of them firstly");
                    EsCheckbox.disable($ele.find(".es-checkbox"));
                }
            }
        }
        else {
            self.$rootElement.find(".es-columns-dropdown-info-checked").removeClass("warning");
            // eslint-disable-next-line no-redeclare
            for (let k = 0; k < self.cfg.options.length; k++) {
                if (self.cfg.options[k].checked == "false") {
                    $ele = self.$rootElement.find(".es-columns-dropdown-list-options").eq(k);
                    $ele.attr("title", $ele.attr("data-oldtitle") || "");
                    EsCheckbox.enable($ele.find(".es-checkbox"));
                }
            }
        }
    }
    saveToCookie() {
        let arr = [];
        for (let i = 0; i < this.cfg.options.length; i++) {
            if (this.cfg.options[i]["checked"] === "true") {
                arr.push(this.cfg.options[i]["name"]);
            }
        }
        cookie(this.cfg.cookieName, arr.join(","), {
            path: this.cfg.cookiePath,
            expires: 7
        });
    }
}

export interface ColumnConfiguratorCfg {
    cookieName: string,
    cookiePath: string,
    container: any,
    title?: string,
    maxAllowCheckedCount?: number,
    options: ColumnConfiguratorCfgOption[],
    onsave?: (options: ColumnConfiguratorCfgOption[]) => void,
    onchange?: (options: ColumnConfiguratorCfgOption[]) => void
}

interface ColumnConfiguratorCfgOption {
    name: string,
    text: string,
    required: "false" | "true",
    checked: "false" | "true"
}