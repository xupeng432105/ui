import { EsDropdownLayerComponent } from "./dropdownlayer";

/**
* It's just a component of transitional period for convinience, there are some used in cms SM part, for reducing jsp loop check, so the developers they do not need to move first option out of loop.
* Copy the example and modify to your code
* ```
*	html:
*   <div class="es-btns-group" id="testBtnGroup">
*       <div class="es-btns-group-btns">
*           <button type="button" class="button es-btns-group-btn"> Default button </button>
*           <button type="button" class="button es-btns-group-btn"> Dropdown button1 </button>
*           <button type="button" class="button es-btns-group-btn"> Dropdown button2 </button>
*       </div>      
*   </div>
*   js:
*   ESCMS.btnsGroup.init($("#testBtnGroup")[0]);
* ```
*/
export class EsBtnsGroup {
    static init(obj: HTMLElement) {
        let $btns = $(obj).find(".es-btns-group-btns").find(".es-btns-group-btn");
        let $dropdownBtns = $btns.slice(1);
        let $obj = $(obj);
        $obj.append($btns);
        if ($dropdownBtns.length > 0) {
            $obj.css("paddingRight", '30px');
            $obj.append('<span class="es-btns-group-arrow iconfont icon-ag-d"></span>');
            $obj.append('<div class="es-btns-group-dropdown" style="display:none;"></div>');
            $obj.find('.es-btns-group-dropdown').append($dropdownBtns);
            let popuplayer_btns = new EsDropdownLayerComponent({
                targetElement: $(obj)[0],
                content: '<div style="padding:10px 0;">' + $obj.eq(0).find(".es-btns-group-dropdown").html() + '</div>',
                customCssClasses: ["btn-group"],
                showTriggers: [],
                hideTriggers: []
            });
            $(obj).find(".es-btns-group-arrow").click(function () {
                popuplayer_btns.toggle('<div style="padding:10px 0;">' + $obj.eq(0).find(".es-btns-group-dropdown").html() + '</div>');
            });
        }
    }

    static initAll() {
        $(".es-btns-group").each(function () {
            EsBtnsGroup.init(this);
        });
    }

    static defaultInit() {
        EsBtnsGroup.initAll();
    }
}