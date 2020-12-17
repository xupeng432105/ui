/**
 * To create a container to show content with a switch icon
 */
export class EsLimitedViewer{
    static TEXT_FOLD = "<span class='iconfont icon-db-ag-u es-limited-viewer-arr' title='Fold'></span>";
    static TEXT_UNFOLD = "<span class='iconfont icon-db-ag-d es-limited-viewer-arr' title='Show more'></span>";
    static MAX_HEIGHT = 1000;
    static CLASS_FOLD = "fold";
    /**
     * ```
     *	html:
     *   <div id="testDiv" data-show-height="40" style="width:300px">
     *       Google LLC is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, search engine, cloud computing, software, and hardware. It is considered one of the Big Four technology companies, alongside Amazon, Apple, and Facebook.
     *   </div>
     *  js:
     *  ESCMS.limitedViewer.init($("#testDiv"));
     * ```
     */
    static init($obj: JQuery) {

        let showHeight = $obj.attr("data-show-height") || 60;
        let shouldCreateSwitcher = false;
        if ($obj.find(".es-limited-viewer-content").length > 0)
            return;

        $obj.addClass("es-limited-viewer");
        $obj.addClass(C.CLASS_FOLD).css("maxHeight", showHeight + "px");
        $obj.wrapInner(function () {
            return '<div class="es-limited-viewer-content"></div>';
        });
        if ($obj.is(":visible")) {
            shouldCreateSwitcher = $obj.height() < $obj.find(".es-limited-viewer-content").height();
        }
        else {
            //Create a copy to get the invisible element height
            let $copyContainer = $("#es-limited-viewer-copy-container");
            if ($copyContainer.length == 0) {
                $("body").append("<div id='es-limited-viewer-copy-container' style='position:fixed; top: -10000px; left:0;visiblity: hidden;'></div>");
                $copyContainer = $("#es-limited-viewer-copy-container");
            }
            $("#es-limited-viewer-copy-container").html($obj[0].outerHTML);
            shouldCreateSwitcher = $copyContainer.find(".es-limited-viewer").height() < $copyContainer.find(".es-limited-viewer-content").height();
            $("#es-limited-viewer-copy-container").remove();

        }
        if (shouldCreateSwitcher) {
            $obj.append('\
    					<div class="es-limited-viewer-switcher">\
    						<a href="javascript:;" class="es-limited-viewer-link">' + C.TEXT_UNFOLD + '</a>\
    					</div>\
    			').addClass("show-switcher");
            $obj.find(".es-limited-viewer-link").click(function () {
                if ($obj.hasClass(C.CLASS_FOLD)) {
                    C.unfold($obj);
                }
                else {
                    C.fold($obj);
                }
            })
        }
    };
    /**
     * Fold a instance
     * ```
     * ESCMS.limitedViewer.fold($div);
     * ```
     */
    static fold($obj: JQuery) {
        $obj.addClass(C.CLASS_FOLD).css("maxHeight", $obj.attr("data-show-height") + "px");
        $obj.find(".es-limited-viewer-link").html(C.TEXT_UNFOLD);
    };
    /**
     * Unfold a instance
     * ```
     * ESCMS.limitedViewer.unfold($div);
     * ```
     */
    static unfold ($obj: JQuery) {
        $obj.removeClass(C.CLASS_FOLD).css("maxHeight", C.MAX_HEIGHT + "px");
        $obj.find(".es-limited-viewer-link").html(C.TEXT_FOLD);
    };
    /**
     * Init All the html elements which have class "es-limited-viewer" when page load
     * ```
     * ESCMS.limitedViewer.initAll();
     * ```
     */
    static initAll() {
        $(".es-limited-viewer").each(function () {
            C.init($(this));
        })
    }
    static defaultInit() {
        C.initAll();
    }
}

const C = EsLimitedViewer;
