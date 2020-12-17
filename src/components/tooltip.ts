import { EsDropdownLayerComponent } from "./dropdownlayer";


function initEsTooltip(htmlObj: HTMLElement) {
    htmlObj["popupComponent"] = new EsDropdownLayerComponent({
        targetElement: $(htmlObj)[0],
        content: getEsTooltipContent(htmlObj),
        width: "300px",
        preferY: 'up'
    });
}
function getEsTooltipContent(htmlObj: HTMLElement) {
    return "<div class='es-tooltip-container'>" + $(htmlObj).attr("es-tooltip") + "</div>";
}

//@Deprecated -- a temp component,used very few in sm
export const tooltip = {
    init: initEsTooltip,
    defaultInit: function () {
        let delay = 200;
        $("[es-tooltip]").each(function () {
            initEsTooltip(this);
        });
        $("body").on("mouseenter", "[es-tooltip]", function () {
            let self = this;
            clearTimeout(this.timeFlag2);
            this.timeFlag1 = setTimeout(function () {
                if (self.popupComponent == null) {
                    initEsTooltip(self);
                }
                self.popupComponent.show(getEsTooltipContent(self));
            }, delay)

        }).on("mouseleave", "[es-tooltip]", function () {
            let self = this;
            clearTimeout(this.timeFlag1);
            this.timeFlag2 = setTimeout(function () {
                self.popupComponent.hide();
            }, delay)
        });
    }
}