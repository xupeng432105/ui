import { isFunction, isParentNode, mergeCfg, mergeCustomCssClasses } from "../utils";

/**
 * A dropdown popup layer, it will check position and descide where to display
 */
export class EsDropdownLayerComponent {
    public cfg: EsDropdownLayerComponentCfg;
    public isShow;
    public x;
    public y;
    public rootElement;
    public $rootElement;
    public scrollElement;
    constructor(cfg: EsDropdownLayerComponentCfg) {
        if (!cfg || !cfg.targetElement) return;
        this.init(cfg);
        return this;
    }
    public init(cfg: EsDropdownLayerComponentCfg) {
        this.mergeConfig(cfg);
        this.bindWin();
        this.bindMouseTrigger();
        this.isShow = false;
        this.x = this.cfg.preferX || "left";
        this.y = this.cfg.preferY || "down";
    }

    public mergeConfig(cfg: EsDropdownLayerComponentCfg) {
        let defaultCfg: EsDropdownLayerComponentCfg = {
            targetElement: document.body,
            content: "",
            preferY: "down",
            //todo
            preferX: "left",
            maxHeight: "500px",
            maxWidth: "500px",
            width: "auto",
            customCssClasses: [],
            showTriggers: ["mouseenter", "click"],
            hideTriggers: ["mouseleave"],
            onShow: function () { },
            onDestroy: function () { }
        };
        this.cfg = mergeCfg(defaultCfg, cfg);
    }
    bindMouseTrigger() {
        let timeflag1;
        let timeflag2;
        $.each(this.cfg.showTriggers, (i, ev) => {
            $(this.cfg.targetElement).on(ev, () => {
                clearTimeout(timeflag1);
                timeflag2 = setTimeout(() => {
                    this.show();
                }, 150)
            })
        });
        $.each(this.cfg.hideTriggers, (i, ev) => {
            $(this.cfg.targetElement).on(ev, () => {
                clearTimeout(timeflag2);
                timeflag1 = setTimeout(() => {
                    this.hide();
                }, 150);
            })
        })
    }
    bindWin() {
        $(window).on("mousedown", (e) => {
            let source = e.target;
            //not parent & not help message
            if (!isParentNode(source, this.cfg.targetElement)) {
                this.hide();
            }
        });
    }
    setMaxHeight() {
        let pos = this.cfg.targetElement.getBoundingClientRect();
        let maxH;
        if (this.y == 'down') {
            maxH = $(window).height() - pos.top - pos.height - 20 + "px";
        } else {
            maxH = pos.top - 20 + "px";
        }
        $(this.rootElement).find(".es-popup-scroll-ele").css("maxHeight", this.cfg.maxHeight <= maxH ? this.cfg.maxHeight : maxH);
    }
    setPosition() {
        let pos_target = this.cfg.targetElement.getBoundingClientRect();
        let pos_root = this.rootElement.getBoundingClientRect();
        if (Math.ceil(pos_target.left) + pos_root.width > $(window).width()) {
            this.x = "right";
        }
        else {
            this.x = "left";
        }
        if (this.cfg.preferY == 'up') {
            if (pos_target.top < ($(window).height() - pos_target.top)
                && pos_root.height > pos_target.top) {
                this.y = 'down';
            }
            else {
                this.y = 'up';
            }
        }
        else if (this.cfg.preferY == 'down') {
            if (pos_target.top > ($(window).height() - pos_target.top)
                && pos_root.height + pos_target.height + pos_target.top > $(window).height()) {
                this.y = "up";
            }
            else {
                this.y = "down";
            }
        }

        let offset = 2;
        if (this.y == 'down')
            $(this.rootElement).css("top", $(this.cfg.targetElement).outerHeight() + offset);
        if (this.y == 'up')
            $(this.rootElement).css("bottom", $(this.cfg.targetElement).outerHeight() + offset);
        if (this.x == 'left')
            $(this.rootElement).css("left", 0);
        if (this.x == 'right')
            $(this.rootElement).css("right", 0);
    }
    setVisible(f: boolean) {
        if (f) {
            $(this.rootElement).css("visibility", "visible");
        }
        else {
            $(this.rootElement).css("visibility", "hidden");
        }
    }
    setDispay(f: boolean) {
        if (f) {
            $(this.rootElement).css("display", "block");
        }
        else {
            $(this.rootElement).css("display", "none");
        }
        this.isShow = f;
    }
    checkIsShow() {
        return $(this.cfg.targetElement).find(".es-popup").length > 0;
    }
    /**
     * @memberof dropdownLayer#show
     * @function
     * @param {String} content 
     */
    show(content?: string) {
        let self = this;
        let rootCssClasses = ["es-popup", " es-ani-zoom-in"];
        rootCssClasses = mergeCustomCssClasses(this.cfg.customCssClasses, rootCssClasses, []);
        if (this.isShow) return;
        $(this.cfg.targetElement).append(
            '<div class="' + rootCssClasses.join(" ") + '" style = "display:none;visibility:hidden;min-width:' + this.cfg.minWidth + ';max-width:' + this.cfg.maxWidth + ';width:' + this.cfg.width + '" >\
						<div class="es-popup-scroll-ele"\
							style="overflow:auto;">\
							'+ (content || this.cfg.content) + '\
						</div>\
					</div >');
        this.rootElement = $(this.cfg.targetElement).find(".es-popup")[0];
        this.scrollElement = $(this.rootElement).find(".es-popup-scroll-ele")[0];
        this.setDispay(true);
        this.setPosition();
        this.setMaxHeight();
        this.setVisible(true);
        if (isFunction(self.cfg.onShow)) {
            self.cfg.onShow();
        }
    }
    hide() {
        $(this.cfg.targetElement).find(".es-popup").remove();
        this.isShow = false;
        if (isFunction(this.cfg.onDestroy)) {
            this.cfg.onDestroy();
        }
    }
    toggle(content?: string) {
        if (this.isShow) {
            this.hide();
        }
        else {
            this.show(content);
        }
    }
}

export interface EsDropdownLayerComponentCfg {
    targetElement: HTMLElement;
    content: string;
    preferY?: "up" | "down";
    //todo
    preferX?: "left" | "right";
    maxHeight?: string;
    maxWidth?: string;
    minWidth?: string;
    width?: string;
    customCssClasses?: string[];
    showTriggers?: string[];
    hideTriggers?: string[];
    onShow?: () => void;
    onDestroy?: () => void;
}