import { EsAlertComponent } from "./components/alert";
import { EsBtnsGroup } from "./components/btngroup";
import { EsCheckbox } from "./components/checkbox";
import { EsColumnConfigurator } from "./components/columnconfigurator";
import { EsConfirmComponent } from "./components/confirm";
import { EsContentEditorComponent } from "./components/contenteditor";
import { EsContentSelectorInputComponent } from "./components/contentselectorinput";
import { EsDropdownLayerComponent } from "./components/dropdownlayer";
import { EsDropdownSelectComponent } from "./components/dropsownselect";
import { EsGlobalSearchComponent } from "./components/globalsearch";
import { EsLimitedViewer } from "./components/limitedviewer";
import { logger } from "./components/logger";
import { EsModal } from "./components/modal";
import { EsPageMode } from "./components/pagemode";
import { EsPercentageBarComponent } from "./components/percentagebar";
import { EsearchInput } from "./components/searchinput";
import { EsSearchLoadingComponent } from "./components/searchloading";
import { EsTab } from "./components/tab";
import { EsTooltip2Component } from "./components/tooltip2";
import { LIB_NAME } from "./cons";
import { libIsLoaded, utils } from "./utils";
/**
 * @internal
 */
const style = require('./css/style.css');

/**
 * @internal
 */
const animation = require('./css/animation.css');
/**
 * Expose an entry in global scope
 * ```
 * console.log(ESCMS);
 * ```
 */
export const ESCMS = {
    logger: logger,
    utils: utils,
    checkbox: EsCheckbox,
    tab: EsTab,
    dropdownLayer: EsDropdownLayerComponent,
    dropdownSelect: EsDropdownSelectComponent,
    tooltip2: EsTooltip2Component,
    pageMode: EsPageMode,
    alert: EsAlertComponent.add,
    confirm: EsConfirmComponent.add,
    onConfirmGroupComplete: EsConfirmComponent.groupCompleteCheck.add,
    btnsGroup: EsBtnsGroup,
    modal: EsModal,
    column: EsColumnConfigurator,
    limitedViewer: EsLimitedViewer,
    searchInput: EsearchInput,
    globalSearch: EsGlobalSearchComponent,
    searchLoading: EsSearchLoadingComponent,
    percentageBar: EsPercentageBarComponent,
    contentSelectorInput: EsContentSelectorInputComponent,
    contentEditor: EsContentEditorComponent
};

//Prevent load twice
if (!libIsLoaded())
{
    $(function(){
        EsCheckbox.defaultInit();
        EsTooltip2Component.defaultInit();
        EsAlertComponent.defaultInit();
        EsConfirmComponent.defaultInit();
        EsearchInput.defaultInit();
        EsPageMode.defautInit();
        EsLimitedViewer.defaultInit();
        EsBtnsGroup.defaultInit();
        EsTab.defaultInit();
        EsContentSelectorInputComponent.defaultInit();
    })
}

window[LIB_NAME] = window[LIB_NAME] || ESCMS; 