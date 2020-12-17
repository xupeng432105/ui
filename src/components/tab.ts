import { isFunction } from "../utils";

export class EsTab {
    static activate ($tabItem: JQuery): void {
        if ($tabItem.length == 0) return;
        if (!$tabItem.hasClass("disabled")) {
            let index = $tabItem.index();
            $tabItem.addClass("active").siblings(".tab-nav-item").removeClass("active");
            $tabItem.parents(".tab").eq(0).find(".tab-flag").eq(0).css({
                "width": + $tabItem.get(0).offsetWidth + "px",
                "transform": "translateX(" + $tabItem.get(0).offsetLeft + "px)"
            }).end().end().find(".tab-content").eq(0).children(".tab-content-pane").eq(index).fadeIn().siblings().hide();
            // eslint-disable-next-line no-undef
            if (isFunction(window["initHelps"])) {
                setTimeout(function () {
                    // eslint-disable-next-line no-undef
                    window["initHelps"]();
                }, 100);
            }
        }
    }
    static defaultInit() {
        $(".tab-nav-item").on("click", function () {
            C.activate($(this));
        });
        $(".tab-nav").each(function () {
            let $activeItem = $(this).find(".tab-nav-item.active");
            if ($activeItem.length == 0) {
                $activeItem = $(this).find(".tab-nav-item").eq(0);
            }
            C.activate($activeItem);
        });
        // Datepicker input , event is bound in calendar.js
        $("body").on("focus", ".es-datepicker-input", function () {
            $(this).parents(".es-datepicker").addClass("focus");
            $(this).attr("autocomplete", "off");
        }).on("blur", ".es-datepicker-input", function () {
            $(this).parents(".es-datepicker").removeClass("focus");
        }).on("click", ".es-datepicker-icon-cal", function () {
            $(this).siblings(".es-datepicker-input").eq(0).focus();
        });
    }
}

const C = EsTab;