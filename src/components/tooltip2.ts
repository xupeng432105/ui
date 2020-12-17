import { isParentNode, mergeCfg } from "../utils";

export const ATTR_LISTEN_DISABLED = "es-tooltip2-listen-disabled";
export const ATTR_DISABLED = "es-tooltip2-disabled";
export const ATTR_LISTEN = "title";
export const ATTR_LISTEN_REPLACEMENT = "es-tooltip2-replacement";
export const ATTR_ID = "es-tooltip2-id";
export const ATTR_REL = "es-tooltip2-rel";
export const CLASS_ROOT_TOOLTIP2 = "es-tooltip2";
export class EsTooltip2Component {
    Y_ARIA_TOP = "top";
    Y_ARIA_BOTTOM = "bottom";
    X_ARIA_LEFT = "left";
    X_ARIA_RIGHT = "right";
    CLASS_ARR_POS_TOP = "pos-top";
    CLASS_ARR_POS_BOTTOM = "pos-bottom";
    CLASS_ARR_POS_LEFT = "pos-left";
    CLASS_ARR_POS_RIGHT = "pos-right";
    //Instance id attribute name of tooltip element
    ATTR_ID = "es-tooltip2-id";
    //Reference id attribute name of tooltip element
    ATTR_REL = ATTR_REL;
    static ATTR_ID_VAL = 1;
    static POSITION_TOP = "top";
    static POSITION_RIGHT = "right";
    rootElement: HTMLElement;
    defaultCfg = {
        $targetElement: "",
        $container: $(document),
        position: C.POSITION_TOP,
        maxWidth: 300,
        width: "auto"
    };
    cfg: EsTooltip2ComponentCfg;

    constructor(cfg: EsTooltip2ComponentCfg) {
        this.init(cfg);
    }

    init(cfg: EsTooltip2ComponentCfg) {
        this.cfg = mergeCfg(this.defaultCfg, cfg);
    }
    //For title
    show(content?: string) {
        if (content != "" && content != undefined) {
            C.clearAll();
            let _htm = this.html(content);
            $("body").append(_htm);
            this.rootElement = $(".es-tooltip2[" + this.ATTR_ID + "=" + C.ATTR_ID_VAL + "]")[0];
            this.setPosition(this);
            $(this.rootElement).css({
                "visibility": "visible"
            });
            this.cfg.$targetElement.attr(this.ATTR_REL, C.ATTR_ID_VAL);
            C.ATTR_ID_VAL++;
        }
    }
    html(content: string) {
        let widthStr = "";
        let maxWidth = this.cfg.maxWidth;
        if (this.cfg.width != "auto") {
            widthStr = "width: " + this.cfg.width + "px";
            if (this.cfg.width > this.cfg.maxWidth)
                maxWidth = this.cfg.width

        }

        if (this.cfg.maxWidth)

            return `<div style='${widthStr};max-width:${maxWidth}px;' class='es-tooltip2' ${this.ATTR_ID}='${C.ATTR_ID_VAL}'>\
                            <div class='es-tooltip2-inner'>${content}</div>\
                            <span class='es-tooltip2-arr'></span>\
                        </div>`;
    }

    destroy() {
        if (this.rootElement) {
            $(this.rootElement).remove();
        }
    }

    setPosition(instance: EsTooltip2Component) {
        if (instance.cfg.position == C.POSITION_RIGHT) {
            let arrWidth = 5;
            let arrHeight = 5;
            let xAria = this.X_ARIA_RIGHT;
            // Position of trigger element
            let pos_target = instance.cfg.$targetElement[0].getBoundingClientRect();
            // Position of tooltip element
            let pos_root: any = {
                width: $(instance.rootElement).outerWidth(),
                height: $(instance.rootElement).outerHeight()
            }
            pos_root.left = pos_target.left + arrWidth + pos_target.width + instance.cfg.$container.scrollLeft();
            pos_root.top = pos_target.top + pos_target.height / 2 - pos_root.height / 2 + instance.cfg.$container.scrollTop();
            if (pos_root.left + pos_root.width > instance.cfg.$container.outerWidth()) {
                pos_root.left = pos_target.left - pos_root.width - arrWidth;
                xAria = this.X_ARIA_LEFT;
            }

            $(instance.rootElement).css({
                "width": pos_root.width + "px",
                "left": pos_root.left + "px",
                "top": pos_root.top + "px"
            });
            // Set arr position
            let $arrElement = $(instance.rootElement).find(".es-tooltip2-arr");
            let arrLeft = xAria == this.X_ARIA_LEFT ? (pos_root.width) : (-arrWidth * 1.5);
            let arrTop = pos_root.height / 2 - arrHeight / 2;
            $arrElement.css({
                "left": arrLeft + "px",
                "top": arrTop + "px"
            }).addClass(xAria == this.X_ARIA_LEFT ? this.CLASS_ARR_POS_RIGHT : this.CLASS_ARR_POS_LEFT)
        }
        else {
            let arrHeight = 5;
            let yAria = this.Y_ARIA_TOP;
            // Position of trigger element
            let pos_target = instance.cfg.$targetElement[0].getBoundingClientRect();
            // Position of tooltip element
            let pos_root: any = {
                width: $(instance.rootElement).outerWidth(),
                height: $(instance.rootElement).outerHeight()
            }
            pos_root.left = pos_target.left + pos_target.width / 2 - pos_root.width / 2 + instance.cfg.$container.scrollLeft();
            pos_root.top = pos_target.top - pos_root.height - arrHeight + instance.cfg.$container.scrollTop();
            if (pos_root.left + pos_root.width > instance.cfg.$container.outerWidth()) {
                pos_root.left = instance.cfg.$container.outerWidth() - pos_root.width;
            }
            else if (pos_root.left < 0) {
                pos_root.left = 0;
            }
            if (pos_root.top < 0) {
                pos_root.top = pos_target.bottom + arrHeight;
                yAria = this.Y_ARIA_BOTTOM;
            }

            $(instance.rootElement).css({
                "width": pos_root.width + "px",
                "left": pos_root.left + "px",
                "top": pos_root.top + "px"
            });
            // Set arr position
            let $arrElement = $(instance.rootElement).find(".es-tooltip2-arr");
            let arrLeft = (pos_target.left + instance.cfg.$container.scrollLeft() + pos_target.width / 2 - $arrElement.outerWidth() / 2) - pos_root.left;
            if (arrLeft < 15)
                arrLeft = 15;
            if (arrLeft > (pos_root.width - 15))
                arrLeft = pos_root.width - 15;
            $arrElement.css({
                "left": arrLeft + "px"
            }).addClass(yAria == this.Y_ARIA_TOP ? this.CLASS_ARR_POS_BOTTOM : this.CLASS_ARR_POS_TOP);
        }

    }

    static clearAll() {
        $("." + CLASS_ROOT_TOOLTIP2).remove();
    }

    static replaceAllListenAttr() {
        $("[" + ATTR_LISTEN + "]").each(function () {
            if (C.checkEnabled(this))
                $(this).attr(ATTR_LISTEN_REPLACEMENT, $(this).attr(ATTR_LISTEN)).removeAttr(ATTR_LISTEN);
        })
    }

    static disableDom(dom: HTMLElement, sign?) {
        if (sign == undefined)
            sign = true;
        $(dom).attr(ATTR_DISABLED, sign);
    }

    static disableDomAndChildren(dom: HTMLElement, sign?) {
        if (sign == undefined)
            sign = true;
        $(dom).attr(ATTR_DISABLED, sign)
            .find("[" + ATTR_LISTEN_REPLACEMENT + "]")
            .attr(ATTR_DISABLED, sign);
    }

    static checkEnabled(dom: HTMLElement) {
        return $(dom).attr(ATTR_DISABLED) === undefined || $(dom).attr(ATTR_DISABLED) as any === false;
    }

    //Recover to title, make it easier to test in browser 
    static recoverDom(dom: HTMLElement) {
        let content = $(dom).attr(ATTR_LISTEN_REPLACEMENT);

        $(dom)
            .attr(ATTR_LISTEN, content)
            .removeAttr(ATTR_LISTEN_REPLACEMENT);

        C.disableDom(dom);
    }

    //Recover to title, make it easier to test in browser, e.g. ESCMS.tooltip2.recoverDomAndChildren("body")
    static recoverDomAndChildren(dom: HTMLElement) {
        $(dom)
            .attr(ATTR_LISTEN, $(dom).attr(ATTR_LISTEN_REPLACEMENT))
            .removeAttr(ATTR_LISTEN_REPLACEMENT)
            .find("[" + ATTR_LISTEN_REPLACEMENT + "]").each(function () {
                let content = $(this).attr(ATTR_LISTEN_REPLACEMENT);
                $(this)
                    .attr(ATTR_LISTEN, $(this).attr(ATTR_LISTEN_REPLACEMENT))
                    .removeAttr(ATTR_LISTEN_REPLACEMENT);

                C.disableDom(this);
            });

        C.disableDom(dom);
    }

    static isEventFrom(e) {
        return $(e.target).hasClass(CLASS_ROOT_TOOLTIP2)
            || $(e.target).parents("." + CLASS_ROOT_TOOLTIP2).length > 0
    }

    static defaultInit() {
        let $LISTENER = $("body");
        let instance: EsTooltip2Component = null;
        let t1, t2;
        // Make it can be disabled in html
        if ($LISTENER.attr(ATTR_LISTEN_DISABLED) as any === false || $LISTENER.attr(ATTR_LISTEN_DISABLED) === undefined) {
            C.replaceAllListenAttr();
            $LISTENER
                .on("mouseenter", function (e) {
                    let obj = e.target;
                    if (instance && !isParentNode(obj, instance.cfg.$targetElement[0])) {
                        instance.destroy();
                        instance = null;
                    }
                })
                .on("mouseenter", ".es-tooltip2", function (e) {
                    clearTimeout(t2);
                    clearTimeout(t1);
                })
                .on("mouseleave", ".es-tooltip2", function (e) {
                    if (instance) {
                        instance.destroy();
                        instance = null;
                    }
                })
                .on("mouseenter", "[" + ATTR_LISTEN + "],[" + ATTR_LISTEN_REPLACEMENT + "]", function (e) {
                    if (C.checkEnabled(this)) {
                        let self = this;
                        e.stopPropagation();
                        t1 = setTimeout(function () {
                            //If element was removed from DOM tree
                            if (!document.body.contains(self)) return;
                            instance = new C({
                                $targetElement: $(self),
                                position: C.POSITION_TOP
                            });

                            let content = instance.cfg.$targetElement.attr(ATTR_LISTEN);

                            if (content != "" && content != undefined) {
                                instance.cfg.$targetElement
                                    .removeAttr(ATTR_LISTEN)
                                    .attr(ATTR_LISTEN_REPLACEMENT, content);
                            }
                            else {
                                content = instance.cfg.$targetElement.attr(ATTR_LISTEN_REPLACEMENT);
                            }
                            content = $.trim(content);

                            instance.show(content);
                        }, 200)
                    }
                })
                .on("mouseleave", "[" + ATTR_LISTEN + "],[" + ATTR_LISTEN_REPLACEMENT + "]", function () {
                    let relId = $(this).attr(ATTR_REL);
                    if (instance && $(instance.rootElement).attr(ATTR_ID) == relId) {
                        t2 = setTimeout(function () {
                            if (instance) {
                                instance.destroy();
                                instance = null;
                            }
                        }, 150)
                    }
                    clearTimeout(t1);
                });
        }
    }
}

const C = EsTooltip2Component;

export interface EsTooltip2ComponentCfg {
    $targetElement: JQuery;
    $container?: JQuery;
    position?: string;
    maxWidth?: number;
    width?: number | "auto";
}