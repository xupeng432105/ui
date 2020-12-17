/**
 * Add a search icon for input, simplify jsp code , add class `search-input` to `input` element and it will be autimatcally generated. 
 * ```
 * <input type="text" class="search-input">
 * ```
 */
export class EsearchInput {
    static init($obj: JQuery) {
        let CLASS_WRAPPER = "search-input-wrapper";
        $obj.each(function () {
            if ($(this).parents("." + CLASS_WRAPPER).hasClass(CLASS_WRAPPER))
                return;
            $(this).wrap(function () {
                return '<span class="' + CLASS_WRAPPER + '"></span>';
            });
            let $rootElement = $(this).parents("." + CLASS_WRAPPER);
            $rootElement
                .append("<span class='iconfont icon-search'></span>");
            $rootElement.width($(this)[0].style.width)
                .height($(this)[0].style.height)
                .css({
                    "marginLeft": $(this).css("marginLeft"),
                    "marginRight": $(this).css("marginRight"),
                    "marginTop": $(this).css("marginTop"),
                    "marginBottom": $(this).css("marginBottom")
                });

            //Remove the transition temporarily
            let oldTransition = $(this).css("transition");
            let self = this;
            $(this).css("transition", "none").css("margin", "0 0 0 0");
            setTimeout(function () {
                $(self).css("transition", oldTransition);
            }, 100);

            $(this).hover(function () {
                $rootElement.addClass("hover");
            }, function () {
                $rootElement.removeClass("hover");
            });
            $(this).focus(function () {
                $rootElement.addClass("focus");
            }).blur(function () {
                $rootElement.removeClass("focus");
            })
        })
    }
    static initAll() {
        $(".search-input").each(function () {
            EsearchInput.init($(this));
        });
    }
    static defaultInit() {
        EsearchInput.initAll();
    }
}