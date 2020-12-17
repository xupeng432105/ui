import { ATTR_VALIDATION, JQ_KEY} from "../cons";
import { utils } from "../utils";
import { CommonCfg, BaseComponent } from "./abs";
import { EsAlertComponent } from "./alert";
import { EsConfirmComponent } from "./confirm";
import { SimpleSubject } from "./simplesubject";
import { ATTR_DISABLED, ATTR_LISTEN, EsTooltip2Component, EsTooltip2ComponentCfg } from "./tooltip2";

/**
 * To create a simple content editor
 */
export class EsContentEditorComponent extends BaseComponent<EsContentEditorCfg>
{
    constructor(cfg: EsContentEditorCfg) {
        super(cfg);
        this.init(cfg);
    }
    static readonly ATTR_ERROR_MESSAGE = "es-content-editor-error";
    static readonly RULE_NAME_REQUIRED = "required";
    static readonly RULE_NAME_UUID = "uuid";
    static readonly MESSAGE_INVALID_UUID = `Please enter a valid UUID: 
    <br> <i>xxxxxxxx</i> (8)-<i>xxxx</i> (4)-<i>xxxx</i> (4)-<i>xxxx</i> (4)-<i>xxxxxxxxxxxx</i> (12) <br>
    <i>x</i> can be number <i>0~9</i> or alphabet <i>a~f</i>, case insensitive, no spaces.`
    static readonly RULES_DEFAULT_SUPPORT = [
        {
            name: EsContentEditorComponent.RULE_NAME_REQUIRED,
            message: ""
        },
        {
            name: EsContentEditorComponent.RULE_NAME_UUID,
            message: EsContentEditorComponent.MESSAGE_INVALID_UUID
        }
    ]
    readonly CLASS_ROOT = "es-content-editor";
    readonly CLASS_TEXT_WRAPPER = "es-content-editor-text-wrapper";
    readonly CLASS_TEXT = "es-content-editor-text";
    readonly CLASS_INPUT_WRPAAER = "es-content-editor-input-wrapper";
    readonly CLASS_INPUT = "es-content-editor-input";
    readonly CLASS_ICON_EDIT = "es-content-editor-icon-edit";
    readonly CLASS_ICON_SAVE = "es-content-editor-icon-save";
    readonly CLASS_ICON_CANCEL = "es-content-editor-icon-cancel";
    readonly CLASS_ICON_CONTAINER = "es-content-editor-icon-container";
    readonly CLASS_INVALID = "invalid";
    readonly INVALID_CODE_REQUIRED = "required";
    readonly INVALID_CODE_UUID = "invalid_uuid";
    readonly STATE_EXIT = "exit";
    readonly STATE_EDIT = "edit";
    tooltipInstance: EsTooltip2Component;
    cfg: EsContentEditorCfg;
    rootCssClasses = [this.CLASS_ROOT];
    textElement: HTMLElement;
    inputElement: HTMLElement;
    oldValue;
    stateChange = new SimpleSubject();
    private defaultCfg: EsContentEditorCfg = {
        targetElement: document.body,
        width: "auto",
        customCssClasses: [],
        val: "",
        rules: [],
        beforeSave: (val: string) => { },
        onError: (rule: Rule) => { }
    };

    init(cfg: EsContentEditorCfg) {
        this.cfg = utils.mergeCfg(this.defaultCfg, cfg);
        this.matchRules(this.cfg.rules);
        this.rootCssClasses = utils.mergeCustomCssClasses(this.cfg.customCssClasses, this.rootCssClasses);
        $(this.cfg.targetElement).html(this.html());
        this.rootElement = $(this.cfg.targetElement).find("." + this.CLASS_ROOT)[0];
        this.textElement = $(this.rootElement).find("." + this.CLASS_TEXT)[0];
        this.inputElement = $(this.rootElement).find("." + this.CLASS_INPUT)[0];
        this.bindEdit();
        this.bindSave();
        this.bindCancel();
        this.bindInput();
        this.bindWin();
        this.oldValue = this.cfg.val;
        this.stateChange.subscribe(val => {
            if (val == this.STATE_EXIT)
                if ($(this.inputElement).attr(C.ATTR_ERROR_MESSAGE))
                    this.hideErrorMsg();
        })
    }

    html() {
        return `<div class="${this.rootCssClasses.join(' ')}" style="width:${this.cfg.width == 'auto' ? 'auto' : (this.cfg.width + 'px')};">
                    <div class="${this.CLASS_TEXT_WRAPPER}">
                        <span 
                        class="${this.CLASS_TEXT}" 
                        ${ATTR_DISABLED} 
                        ${ATTR_LISTEN}="${this.cfg.val}">${this.cfg.val}</span>
                        <a 
                            href="javascript:;" 
                            class="iconfont icon-edit ${this.CLASS_ICON_EDIT}" 
                            ${ATTR_LISTEN}="Edit"></a>
                    </div>
                    <div class="${this.CLASS_INPUT_WRPAAER}" style="display:none;">
                        <input class="${this.CLASS_INPUT}" 
                            type="text" 
                            ${ATTR_VALIDATION}="true" 
                            value="${this.cfg.val}">
                        <div class="${this.CLASS_ICON_CONTAINER}">
                        <a 
                            href="javascript:;" 
                            class="iconfont icon-true ${this.CLASS_ICON_SAVE}" 
                            ${ATTR_LISTEN}="Save"></a>
                    </div>
                </div>`;
    }

    edit() {
        $(this.rootElement).find("." + this.CLASS_TEXT_WRAPPER).hide();
        $(this.rootElement).find("." + this.CLASS_INPUT_WRPAAER).show();
        $(this.inputElement).trigger("focus").trigger("select");
        if (this.oldValue == $(this.inputElement).val())
            $(this.rootElement).find("." + this.CLASS_ICON_SAVE).addClass("disabled")
        else
            $(this.rootElement).find("." + this.CLASS_ICON_SAVE).removeClass("disabled")
    }

    exit() {
        $(this.rootElement).find("." + this.CLASS_TEXT_WRAPPER).show();
        $(this.rootElement).find("." + this.CLASS_INPUT_WRPAAER).hide();
        this.stateChange.next(this.STATE_EXIT);
    }

    save(val: string) {
        $(this.textElement).html(val);
        this.oldValue = $(this.inputElement).val();
        this.exit();
    }

    cancel() {
        this.restore();
        this.exit();
    }

    restore() {
        $(this.inputElement).val(this.oldValue);
        this.removeError();
    }

    isEdit() {
        return $(this.rootElement).find("." + this.CLASS_INPUT_WRPAAER).is(":visible");
    }

    validate(): Rule {
        if (this.cfg.rules && this.cfg.rules.length > 0) {
            const val = $(this.inputElement).val() as string;
            for (let i = 0; i < this.cfg.rules.length; i++) {
                let rule = this.cfg.rules[i];
                if (!rule.func) {
                    switch (rule.name) {
                        case C.RULE_NAME_REQUIRED:
                            if ($.trim(val) == "")
                                return rule;
                            else
                                continue;
                        case C.RULE_NAME_UUID:
                            if (!($.trim(val)).match(/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i))
                                return rule;
                            else
                                continue;
                    }
                }
                else {
                    if (!rule.func.call(this, $(this.inputElement).val()))
                        return rule;
                    else
                        continue;
                }
            }
        }
        return null;
    }

    setError(msg?: string, options?: ErrorOptions) {
        $(this.inputElement).addClass(this.CLASS_INVALID);
        this.showErrorMsg(msg, options);
    }

    removeError() {
        this.hideErrorMsg();
        $(this.inputElement).removeClass(this.CLASS_INVALID);
    }

    //Trigger beforeSave hook and update view
    private triggerSave() {
        let rule = this.validate();
        if (rule != null) {
            $(this.inputElement).addClass(this.CLASS_INVALID);
            this.cfg.onError.call(this, rule);
            if (rule.message) {
                this.showErrorMsg(rule.message);
            }
            return;
        }
        else {
            $(this.inputElement).removeClass(this.CLASS_INVALID);
            this.hideErrorMsg();
        }
        if ($(this.rootElement).find("." + this.CLASS_ICON_SAVE).hasClass("disabled"))
            return;
        if (utils.isFunction(this.cfg.beforeSave)) {
            var r = this.cfg.beforeSave.call(this, $(this.inputElement).val());
            if (r === false)
                return;
        }
        this.save($(this.inputElement).val() as string);
    }

    //Bind edit icon event
    private bindEdit() {
        $(this.rootElement).find("." + this.CLASS_ICON_EDIT).on("click", () => {
            this.edit();
        })
    }

    //Bind save icon event
    private bindSave() {
        $(this.rootElement).find("." + this.CLASS_ICON_SAVE).on("click", () => {
            this.triggerSave();
        })
    }

    //Bind cancel icon event
    private bindCancel() {
        $(this.rootElement).find("." + this.CLASS_ICON_CANCEL).on("click", () => {
            this.exit();
        })
    }

    //Bind input event
    private bindInput() {
        $(this.inputElement).on("keyup", (e) => {
            console.log(e);
            console.log(e.key);
            if (e.key == JQ_KEY.enter) {
                this.triggerSave();
            }
            else if (e.key == JQ_KEY.esc) {
                
                this.exit();
            }
        }).on("input", (e) => {
            if ($(this.inputElement).val() != this.oldValue)
                $(this.rootElement).find("." + this.CLASS_ICON_SAVE).removeClass("disabled");
            else
                $(this.rootElement).find("." + this.CLASS_ICON_SAVE).addClass("disabled");
        }).on("mouseenter", (e) => {
            if ($(this.inputElement).hasClass(this.CLASS_INVALID))
                this.showErrorMsg();
        })
    }

    private showErrorMsg(msg?: string, options: ErrorOptions = { maxWidth: 400 }) {
        if (this.tooltipInstance == null) {
            if (msg) {
                $(this.inputElement).attr(C.ATTR_ERROR_MESSAGE, msg);
            }
            if ($(this.inputElement).attr(C.ATTR_ERROR_MESSAGE) != undefined && $(this.inputElement).attr(C.ATTR_ERROR_MESSAGE) != "") {
                var cfg: EsTooltip2ComponentCfg = {
                    $targetElement: $(this.inputElement),
                    position: EsTooltip2Component.POSITION_RIGHT
                };
                if (options && options.maxWidth)
                    cfg.maxWidth = options.maxWidth;
                this.tooltipInstance = new EsTooltip2Component(cfg);
                this.tooltipInstance.show($(this.inputElement).attr(C.ATTR_ERROR_MESSAGE));
            }
        }
        else {
            this.tooltipInstance.show($(this.inputElement).attr(C.ATTR_ERROR_MESSAGE));
        }
    }

    private hideErrorMsg() {
        $(this.inputElement).removeAttr(C.ATTR_ERROR_MESSAGE);
        if (this.tooltipInstance != null) {
            this.tooltipInstance.destroy();
            this.tooltipInstance = null;
        }
    }

    private bindWin() {
        $(window).on("mousedown", (e) => {
            if (!this.isEdit())
                return;
            if (EsAlertComponent.isEventFrom(e) || EsConfirmComponent.isEventFrom(e) || EsTooltip2Component.isEventFrom(e))
                return;
            if (!this.rootElement.contains(e.target as any)) {
                this.cancel();
            }
        })
    }

    private matchRules(rules: Rule[]) {
        rules.forEach((rule, i) => {
            C.RULES_DEFAULT_SUPPORT.forEach(defaultRule => {
                if (rule.name == defaultRule.name) {
                    rules[i] = Object.assign({}, defaultRule, rule);
                }
            })
        })
    }
}

const C = EsContentEditorComponent;

interface EsContentEditorCfg extends CommonCfg {
    targetElement: HTMLElement;
    val: string | number;
    width?: number | "auto";
    rules?: Rule[];
    beforeSave?: (val: string) => boolean | undefined | void;
    onError?: (rule: Rule) => void;
}

interface Rule {
    name: string;
    func?: (val: string) => boolean;
    message?: string;
}

interface ErrorOptions {
    maxWidth?: number
}