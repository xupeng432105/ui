import { checkDisabledAttrExist, isFunction, mergeCfg, parseJSON } from "../utils";


export class EsContentSelectorInputComponent {
    constructor(cfg: ESContentSelectorInputCfg) {
        this.init(cfg);
    }
    static readonly CLASSNAME_INPUT = "es-content-selector-input";
    static readonly CLASSNAME_WRAPPER = "es-content-selector-input-wrapper";
    static readonly CLASSNAME_TEXT = "es-content-selector-text";
    static readonly ATTR_TYPE = "es-content-selector-type";
    static readonly ATTR_DISABLED = "es-content-selector-disabled";
    cfg: ESContentSelectorInputCfg;

    init(cfg: ESContentSelectorInputCfg) {
        let self = this;
        this.mergeCfg(this, cfg);
        if (this.cfg.$targetElement.length == 0 || checkDisabledAttrExist(this.cfg.$targetElement[0], C.ATTR_DISABLED)) {
            return;
        }
        if (this.cfg.$targetElement[0].tagName.toLowerCase() == "input") {
            //To prevent dumplicate triggered 
            if (!this.checkInitialized()) {
                this.proxyValueChange(this.cfg.$targetElement[0]);
            }
            let id = this.cfg.$targetElement.val();
            if (id) {
                let type = this.cfg.$targetElement.attr(C.ATTR_TYPE);
                this.doRequest(id, type, (res) => {
                    if (res && res.indexOf("error") < 0) {
                        res = parseJSON(res);
                    }
                    let contextPath = $("#contextPath").val();
                    let href = "";
                    let href_seg_program = contextPath + "/content/program/edit.do?&program.id=";
                    let href_seg_game = contextPath + "/content/gameschedule/editInput.do?id=";
                    let href_seg_category = contextPath + "/content/category/list.do?searchId=";
                    let href_seg_channel = contextPath + "/content/linearchannel/edit.do?id=";
                    let href_seg_player = contextPath + "/content/menu/list.do?playerId=";
                    if (type == "program") {
                        href += href_seg_program + id;
                    }
                    else if (type == "game") {
                        href += href_seg_game + id;
                    }
                    else if (type == "category") {
                        href += href_seg_category + id;
                    }
                    else if (type == "channel") {
                        href += href_seg_channel + id;
                    }
                    else if (type == "player") {
                        href += href_seg_player + id;
                    }
                    C.generateHTML(self.cfg.$targetElement[0], id as string, res.name, href);
                });
            }
            else {
                C.generateHTML(self.cfg.$targetElement[0], "", "", "");
            }
        }
        else {
            console.log("Target should be an input element");
        }
    }
    private checkInitialized() {
        return C.checkInitialized(this.cfg.$targetElement[0]);
    }
    private mergeCfg(instance: EsContentSelectorInputComponent, cfg: ESContentSelectorInputCfg) {
        let defaultCfg = {
            $targetElement: ""
        };
        instance.cfg = mergeCfg(defaultCfg, cfg);
    }
    private doRequest(id: any, type: string, callback: (res: any) => void) {
        let contextPath = $("#contextPath").val();
        if (window["post"]) {
            window["post"](contextPath + "/content/getcontentinfo.do?id=" + id + "&type=" + type, {}, function (res) {
                if (isFunction(callback)) {
                    callback.call(this, res);
                }
            }, false, { async: false });
        }

    }

    private proxyValueChange(input: HTMLElement) {
        let descriptor = Object.getOwnPropertyDescriptor(input.constructor.prototype, 'value');
        Object.defineProperty(input.constructor.prototype, 'value', {
            configurable: true,
            enumerable: true,
            get: function () {
                return descriptor.get.call(this);
            },
            set: function () {
                descriptor.set.apply(this, arguments);
                if (this == input)
                    C.init({
                        $targetElement: $(this)
                    })
            }
        })
    }

    static init(cfg: ESContentSelectorInputCfg) {
        return new C(cfg);
    }

    static initAll() {
        $("." + C.CLASSNAME_INPUT).each(function () {
            C.init({
                $targetElement: $(this)
            });
        })
    }

    static checkInitialized(input: HTMLElement) {
        return $(input).parents("." + C.CLASSNAME_WRAPPER).length > 0;
    }

    static generateHTML(input: HTMLElement, id: string, name: string, href: string) {
        let $rootElement;
        let $textElement;
        // To prevent focus
        $(input).attr("tabindex", "-1").addClass(C.CLASSNAME_INPUT);
        // Wrapper element
        if (!C.checkInitialized(input)) {
            $(input).wrap("<span class='" + C.CLASSNAME_WRAPPER + "'></span>");
        }
        $rootElement = $(input).parents("." + C.CLASSNAME_WRAPPER);

        // Text element
        if ($rootElement.find("." + C.CLASSNAME_TEXT).length == 0) {
            $rootElement.append("<a class='" + C.CLASSNAME_TEXT + " ellipsis'></a>");
        }
        $textElement = $rootElement.find("." + C.CLASSNAME_TEXT);

        let width = $(input).outerWidth();
        let paddingLeft = +$textElement.css("paddingLeft").split("px")[0];
        let paddingRight = +$textElement.css("paddingRight").split("px")[0];
        $textElement.width(width - paddingLeft - paddingRight);

        if (id != undefined && id != null && id != "") {
            let displayText = "(ID: " + id + ") " + (name || "");
            $textElement
                .attr("href", href || "#")
                .html(displayText)
        }
        else {
            $textElement
                .removeAttr("href")
                .html("")
        }
    };
    static defaultInit() {
        C.initAll();
    }
}

const C = EsContentSelectorInputComponent;

export interface ESContentSelectorInputCfg {
    $targetElement: JQuery;
}