import { JQ_EVENT } from "../cons";
import { cookie, isFunction } from "../utils";

/**
 * Switch sidebar, used in CMS
 */
export class EsPageMode{
    /**
     * Change page to large mode
     * ```
     * ESCMS.pageMode.showLarge()
     * ```
     */
    static showLarge() {
        $(".menuheader .logo-wrapper").removeClass("mini");
        $("#sidebarToggler").removeClass("active");
        $("#leftPanel").removeClass("mini");
        EsPageMode.checkAndInitHelps();
        cookie('sidebarStatus', 'unfold', { path: "/" });

    }
    /**
     * Change page to mini mode
     * ```
     * ESCMS.pageMode.showMini()
     * ```
     */
    static showMini() {
        if ($("#leftPanel").length > 0) {
            $(".menuheader .logo-wrapper").addClass("mini");
            $("#sidebarToggler").addClass("active");
            $("#leftPanel").addClass("mini");
            EsPageMode.checkAndInitHelps();
            cookie('sidebarStatus', 'fold', { path: "/" });
        }
        else {
            EsPageMode.showLarge();
        }
    }
    /**
     * Switch page mode large/mini
     * ```
     * ESCMS.pageMode.toggle()
     * ```
     */
    static toggle() {
        if ($("#sidebarToggler").hasClass("active")) {
            EsPageMode.showLarge();
        }
        else {
            EsPageMode.showMini();
        }
    }
    /**
     * Check the function initHelps in other files
     */
    static checkAndInitHelps() {
        if (isFunction((window as any).initHelps)) {
            // eslint-disable-next-line no-undef
            window["initHelps"]();
        }
    }
    static defautInit() {
        setTimeout(function () {
            if ($("#leftPanel").length == 0) {
                $("#sidebarToggler").hide();
            }
        }, 0);
        $("#sidebarToggler").on(JQ_EVENT.click,function () {
            EsPageMode.toggle();
        });
    }
}