import { JQ_EVENT, JQ_KEY } from "../cons";
import { cookie, mergeCfg, fuzzyHighlightText2, distinctJSONArrayByKey, parseJSON } from "../utils";
import { EsDropdownLayerComponent } from "./dropdownlayer";
/**
 * Create a global search UI, not a common component, only used in CMS
*/
export class EsGlobalSearchComponent {
    $rootElement: JQuery;
    $searchInput: JQuery;
    cfg: EsGlobalSearchComponentCfg;
    historyPointer;
    t;
    dropdown: EsDropdownLayerComponent;
    private static STORAGEKEY_HISTORY = "gshis";
    constructor(cfg: EsGlobalSearchComponentCfg) {
        this.init(cfg);
    }
    init(cfg: EsGlobalSearchComponentCfg) {
        this.mergeConfig(cfg);
        if ($(this.cfg.targetElement).find(".gs").length > 0)
            return;
        this.createContainer();
        this.createInput();
        this.initDropdown();
        this.historyPointer = null;
    }
    mergeConfig(cfg: EsGlobalSearchComponentCfg) {
        let defaultCfg: EsGlobalSearchComponentCfg = {
            targetElement: $("body")[0],
            context: "iptv-admin/",
            contentTypes:
                [
                    { name: "Configuration", path: "/manage/other/config/list.do", param: "criteria" }
                ]
        };
        this.cfg = mergeCfg(defaultCfg, cfg);
    }
    createContainer() {
        let htm = '<div class="gs"></div>';
        let instance = this;
        $(this.cfg.targetElement).append(htm);
        this.$rootElement = $(this.cfg.targetElement).find(".gs");
        this.$rootElement.on("click", ".gs-dropdown-menulist-item", function (e) {
            let url = $(this).attr("data-url");
            if (url)
                location.href = url;
        })
            .on("click", ".gs-dropdown-contentlist-item", function (e) {
                let url = $(this).attr("data-url");
                if (url) {
                    if ($(this).attr("data-useform") === "true") {
                        let id = "gsForm";
                        let action = location.protocol + "//" + location.host + instance.cfg.context + $(this).attr("data-path");
                        let criteria = $.trim(this.getSearchValue(instance));
                        $(this).append("<form class='hidden' method='POST' id='" + id + "' action='" + action + "'><input name='criteria' value='" + criteria + "'></form>");
                        $("#" + id).submit();
                    }
                    else {
                        location.href = url;
                    }
                }

            })
            .on("click", ".gs-dropdown-historylist-item", function () {
                instance.$searchInput.val($(this).html());
                instance.doSearch();
            })
            .on("click", ".gs-dropdown-menulist-item", function (e) {
                if (localStorage) {
                    let history = instance.getHistory();
                    history.push($(this).attr("data-name"));
                    cookie(C.STORAGEKEY_HISTORY, history.join(","), {
                        path: "/",
                        expires: 1
                    });
                }

            });
    }
    createInput() {
        let instance = this;
        let htm = '<div class="gs-input-wrapper">\
                        <span class="iconfont icon-search"></span>\
                        <input type="text" class="gs-search-input" placeholder="Search or go to..." autocomplete="off"/>\
                    </div>';
        this.$rootElement.append(htm);
        this.$searchInput = this.$rootElement.find(".gs-search-input");
        this.$searchInput.focus(function (e) {
            if ($.trim(getSearchValue(instance)) != "") {
                instance.doSearch();
            }
        }).on(JQ_EVENT.keydown, function (e) {
            handelKeyDown(instance, e);
        }).on(JQ_EVENT.keyup, function (e) {
            if (e.key != JQ_KEY.down
                && e.key != JQ_KEY.up
                && e.key != JQ_KEY.esc
                && e.key != JQ_KEY.enter) {
                instance.doSearch();
            }
        })
    }
    initDropdown() {
        this.dropdown = new EsDropdownLayerComponent({
            targetElement: $(this.$rootElement)[0],
            content: '<div class="gs-dropdown"></div>',
            maxHeight: '800px'
        });
    }
    showDropdown() {
        this.dropdown.show();
    }
    hideDropdown() {
        this.dropdown.hide();
    }
    generateMenusHTML(menus, keywords) {
        let htm = '';
        keywords = $.trim(keywords);
        if (menus.length > 0) {
            htm += '<div class="gs-dropdown-section gs-dropdown-section-menu">\
                        <div class="gs-dropdown-section-header">Menu</div>\
                        <ul class="gs-dropdown-menulist">';
            for (let i = 0; i < menus.length; i++) {
                htm += '<li class="gs-dropdown-list-item gs-dropdown-menulist-item" data-name="' + menus[i].name + '" data-url="' + (location.protocol + "//" + location.host + this.cfg.context + menus[i].path) + '" data-path="' + menus[i].path + '">\
                            <span class="iconfont icon-menu"></span>\
                            <div class="gs-dropdown-menulist-item-text">' + fuzzyHighlightText2(menus[i].name, keywords) + '</div>\
                            <span class="iconfont icon-enter"></span>\
                        </li>';
            }
            htm += '</ul>\
                </div>';
        }
        return htm;
    }
    generateContentHTML(datas, keywords) {
        let htm = '';
        keywords = $.trim(keywords);
        htm += '<div class="gs-dropdown-section gs-dropdown-section-content">\
                    <div class="gs-dropdown-section-header">Content</div>\
                    <ul class="gs-dropdown-contentlist">';
        for (let i = 0; i < datas.length; i++) {
            htm += '<li class="gs-dropdown-list-item gs-dropdown-contentlist-item" data-url="' + (location.protocol + "//" + location.host + this.cfg.context + datas[i].path + "?" + datas[i].param + "=" + encodeURIComponent(keywords)) + '" data-path="' + datas[i].path + '" data-useform="' + (datas[i].useForm === 'true' ? 'true' : 'false') + '">\
                        <span class="iconfont icon-search"></span>\
                        <div class="gs-dropdown-contentlist-item-text">" <span class="strong">' + keywords + '</span> " in ' + datas[i].name + '\
                        <span class="iconfont icon-enter"></span>\
                        </div>\
                    </li>';
        }
        htm += '</ul>\
            </div>';
        return htm;
    }
    doSearch() {
        let instance = this;
        instance.historyPointer = null;
        clearTimeout(this.t);
        this.t = setTimeout(function () {
            let htm;
            if ($.trim(getSearchValue(instance)) == "") {
                instance.hideDropdown();
            }
            else {
                let keywords = $.trim(getSearchValue(instance));
                instance.showDropdown();
                // eslint-disable-next-line no-undef
                if (window["post"]) {
                    window["post"](location.origin + instance.cfg.context + "/globalsearch.do?criteria=" + encodeURIComponent(keywords), null, function (res) {
                        let menu = instance.generateMenusHTML(distinctJSONArrayByKey(parseJSON(res), "name"), keywords);
                        let content = instance.generateContentHTML(instance.cfg.contentTypes, keywords);
                        htm = menu + content;
                        instance.$rootElement.find(".gs-dropdown").html(htm);
                        $(".gs-dropdown-list-item").eq(0).addClass("active");
                    }, false, { async: true });
                }
            }
        }, 150);
    }
    getHistory() {
        let ret = cookie(C.STORAGEKEY_HISTORY);
        if (!ret)
            ret = [];
        else
            ret = ret.split(",");
        return ret;
    }

}

function handelKeyDown(instance: EsGlobalSearchComponent, e?) {
    let allItems = instance.$rootElement.find(".gs-dropdown-list-item");
    let activeItem = instance.$rootElement.find(".gs-dropdown-list-item.active");
    if (e.key == JQ_KEY.down) {
        e.preventDefault();
        if (instance.$rootElement.find(".gs-dropdown").length == 0) {
            let history = instance.getHistory();
            if (history.length > 0) {
                if (instance.historyPointer || instance.historyPointer == 0) {
                    if ((instance.historyPointer + 1) <= (history.length - 1)) {
                        instance.historyPointer = instance.historyPointer + 1;
                        instance.$searchInput.val(history[instance.historyPointer]);
                    }
                    else {
                        instance.historyPointer = (history.length - 1);
                        instance.$searchInput.val("");
                    }
                }
            }
        }
        else {
            if (activeItem.length == 0) {
                allItems.removeClass("active").eq(0).addClass("active");
            }
            else {
                let index = allItems.index(activeItem);
                let next = index < (allItems.length - 1) ? (index + 1) : 0;
                allItems.removeClass("active").eq(next).addClass("active");
            }
        }

    }
    else if (e.key == JQ_KEY.up) {
        e.preventDefault();
        if (instance.$rootElement.find(".gs-dropdown").length == 0) {
            // eslint-disable-next-line no-redeclare
            let history = instance.getHistory();
            if (history.length > 0) {
                if (instance.historyPointer || instance.historyPointer == 0) {
                    instance.historyPointer = (instance.historyPointer - 1) >= 0 ? (instance.historyPointer - 1) : 0;
                }
                else {
                    instance.historyPointer = history.length - 1;
                }
                instance.$searchInput.val(history[instance.historyPointer]);
            }
        }
        else {
            if (activeItem.length == 0) {
                allItems.removeClass("active").eq(allItems.length - 1).addClass("active");
            }
            else {
                // eslint-disable-next-line no-redeclare
                let index = allItems.index(activeItem);
                let prev = index > 0 ? (index - 1) : (allItems.length - 1);
                allItems.removeClass("active").eq(prev).addClass("active");
            }
        }

    }
    else if (e.key == JQ_KEY.esc) {
        instance.hideDropdown();
    }
    else if (e.key == JQ_KEY.enter) {
        if (instance.$rootElement.find(".gs-dropdown").length == 0) {
            if ($.trim(instance.$searchInput.val() as any) != "") {
                instance.doSearch();
            }
        }
        else {
            if (activeItem.length > 0) {
                activeItem.click();
            }
        }

    }
}

const C = EsGlobalSearchComponent;

function getSearchValue(instance: EsGlobalSearchComponent): string {
    return instance.$rootElement.find(".gs-search-input").val() as any;
}

export interface EsGlobalSearchComponentCfg {
    targetElement: HTMLElement,
    context: String,
    contentTypes: EsGlobalSearchComponentCfgContentType[]
}

interface EsGlobalSearchComponentCfgContentType {
    name: String;
    path: String;
    param: String
}