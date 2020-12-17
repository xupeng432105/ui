import { isFunction } from "../utils";

/**
 * Usually add a class `es-checkbox` to a html `checkbox` element, and it will be automatically initilized to newui style by {@link EsCheckbox.defaultInit} method
 * ```
 * <input class="es-checkbox" type="checkbox">
 * ```
 * If a html `checkbox` element is created by js, you have to manually initialize it by `init` or `initAll`.
 * ```
 * ESCMS.checkbox.init($checkbox)
 * ```
 */
export class EsCheckbox {
    /**
     * Can be used to generate a checkbox to newui style.
     * @param $checkbox
     * @param callback 
     * ```
     * ESCMS.checkbox.init($checkbox);
     * ```
     */
    static init($checkbox: JQuery, callback?: () => void) {
        if (!$checkbox.hasClass("es-checkbox")) {
            $checkbox.addClass("es-checkbox");
        }
        // If not been wrapped yet ,do it
        if (!$checkbox.parent().hasClass("es-checkbox-wrapper")) {
            $checkbox.wrap(function () {
                return '<span class="es-checkbox-wrapper"></span>';
            });
            $checkbox.parent().prepend('<span class="icon-chkbox"></span>');
        }
        // Refresh its status:display/checked/disabled
        let $parent = $checkbox.parents(".es-checkbox-wrapper");
        if ($checkbox.is(":checked")) {
            EsCheckbox.check($checkbox);
        } else {
            EsCheckbox.uncheck($checkbox);
        }
        if ($checkbox.is(":disabled")) {
            $parent.addClass("disabled");
        } else {
            $parent.removeClass("disabled");
        }
        if ($checkbox.css("display") == 'none') {
            $parent.hide();
        }
        else {
            $parent.show();
        }
        if (isFunction(callback)) {
            callback();
        }
    }
    /**
     * Can be used to make all checkbox which have class "es-checkbox" to newui
     * ```
     * ESCMS.checkbox.initAll();
     * ```
     */
    static initAll() {
        $("input[type=checkbox].es-checkbox").each(function () {
            EsCheckbox.init($(this));
        });
        $("input[type=checkbox].es-checkbox-hidden").each(function () {
            EsCheckbox.initNextTo($(this));
        })
    }
    /**
     * Can be used to disable a newui checkbox,both styles and behavior
     * @param $checkbox 
     * ```
     * ESCMS.checkbox.disable($checkbox);
     * ```
     * 
     */
    static disable($checkbox: JQuery) {
        if ($checkbox.length == 0) return;
        $checkbox.prop("disabled", true).attr("disabled", "disabled").parents(".es-checkbox-wrapper").addClass("disabled");

        // origin_checkbox & ref_checkbox not common case
        if ($checkbox[0]["origin_checkbox"]) {
            $($checkbox[0]["origin_checkbox"]).prop("disabled", true).attr("disabled");
        }
        if ($checkbox[0]["ref_checkbox"]) {
            $($checkbox[0]["ref_checkbox"]).prop("disabled", true).attr("disabled", "disabled").parents(".es-checkbox-wrapper").addClass("disabled");
        }
    }
    /**
     * Can be used to enable a newui checkbox,both styles and behavior
     * @param $checkbox 
     * ```
     * ESCMS.checkbox.enable($checkbox);
     * ```
     */
    static enable($checkbox: JQuery) {
        if ($checkbox.length == 0) return;
        $checkbox.prop("disabled", false).removeAttr("disabled").parents(".es-checkbox-wrapper").removeClass("disabled");

        // origin_checkbox & ref_checkbox not common case
        if ($checkbox[0]["origin_checkbox"]) {
            $($checkbox[0]["origin_checkbox"]).prop("disabled", false).removeAttr("disabled");
        }
        if ($checkbox[0]["ref_checkbox"]) {
            $($checkbox[0]["ref_checkbox"]).prop("disabled", false).removeAttr("disabled").parents(".es-checkbox-wrapper").removeClass("disabled");
        }
    }
    /**
     * Can be used to check a newui checkbox,both styles and behavior
     * @param $checkbox 
     * ```
     * ESCMS.checkbox.check($checkbox);
     * ```
     */
    static check($checkbox: JQuery) {
        if ($checkbox.length == 0) return;
        $checkbox.prop("checked", true).attr("checked", "checked").parents(".es-checkbox-wrapper").addClass("checked");

        if ($checkbox[0]["origin_checkbox"]) {
            $($checkbox[0]["origin_checkbox"]).prop("checked", true).attr("checked", "checked");
        }
        if ($checkbox[0]["ref_checkbox"]) {
            $($checkbox[0]["ref_checkbox"]).prop("checked", true).attr("checked", "checked").parents(".es-checkbox-wrapper").addClass("checked");
        }
    }
    /**
     * Can be used to uncheck a newui checkbox,both styles and behavior
     * @param $checkbox 
     * ```
     * ESCMS.checkbox.uncheck($checkbox);
     * ```
     */
    static uncheck($checkbox: JQuery) {
        if ($checkbox.length == 0) return;
        $checkbox.prop("checked", false).removeAttr("checked").parents(".es-checkbox-wrapper").removeClass("checked");

        if ($checkbox[0]["origin_checkbox"]) {
            $($checkbox[0]["origin_checkbox"]).prop("checked", false).removeAttr("checked");
        }

        if ($checkbox[0]["ref_checkbox"]) {
            $($checkbox[0]["ref_checkbox"]).prop("checked", false).removeAttr("checked").parents(".es-checkbox-wrapper").removeClass("checked");
        }
    }
    /**
     * Can be used to hide a newui checkbox,both styles and behavior
     * @param $checkbox 
     * ```
     * ESCMS.checkbox.hide($checkbox);
     * ```
     */
    static hide($checkbox: JQuery) {
        $checkbox.hide().parents(".es-checkbox-wrapper").hide();
    }
    /**
     * Can be used to show a newui checkbox,both styles and behavior
     * @param $checkbox 
     * ```
     * ESCMS.checkbox.show($checkbox);
     * ```
     */
    static show($checkbox: JQuery) {
        $checkbox.show().parents(".es-checkbox-wrapper").show();
    }
    /**
     * Can be used to init another checkbox next to the origin checkbox and establish relationship for them, this function is used when the origin checkbox value not be sent when form submit,but this case rarely happened
     * @param $checkbox 
     * ```
     * ESCMS.checkbox.initNextTo($checkbox);
     * ```
     */
    static initNextTo($checkbox: JQuery) {
        if ($checkbox.length == 0) {
            console.log("can not find the checkbox");
            return;
        }
        if ($checkbox.next().hasClass("es-checkbox-wrapper")) return;
        $checkbox.after("<input type='checkbox' class='es-checkbox'>");
        let $anotherCheckbox = $checkbox.next();
        if ($checkbox.is(":checked")) {
            $anotherCheckbox.prop("checked", true).attr("checked", "checked");
        }
        if ($checkbox.is(":disabled")) {
            $anotherCheckbox.prop("disabled", true).attr("disabled", "disabled");
        }
        EsCheckbox.init($anotherCheckbox);
        $anotherCheckbox[0]["origin_checkbox"] = $checkbox[0];
        $checkbox[0]["ref_checkbox"] = $anotherCheckbox[0];
    }
    static defaultInit() {
        EsCheckbox.initAll();
        $("body")
            .on("click", "input[type=checkbox].es-checkbox", function () {
                if ($(this).is(":checked")) {
                    EsCheckbox.check($(this));
                }
                else {
                    EsCheckbox.uncheck($(this));
                }
            })
            .on("click", ".es-checkbox-chkall", function () {
                if ($(this).hasClass("disabled")) return;
                let rel = $(this).attr("es-rel");
                let $relChkbox = $("." + rel);
                if ($(this).is(":checked")) {
                    $relChkbox.each(function () {
                        if (!$(this).is(":disabled"))
                            EsCheckbox.check($(this));
                    })
                }
                else {
                    $relChkbox.each(function () {
                        if (!$(this).is(":disabled"))
                            EsCheckbox.uncheck($(this));
                    })
                }
            });
    }
}

