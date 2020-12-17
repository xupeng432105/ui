import { isFunction } from "../utils";

/**
 * Method `defaultInit` will proxy `window.alert` with `ESCMS.alert`, add attribute {@link EsAlertComponent.ATTR_LISTEN_DISABLED} to `body` element to disable this feature
 * ```
 * ESCMS.alert("Some message", cb) or alert("Some message", cb)
 * ```
 */
export class EsAlertComponent {
    static instances: AlertMsg[] = [];
    static readonly ATTR_LISTEN_DISABLED = "es-alert-disabled";
    static readonly CLASS_ROOT_ALERT = "es-alert";
    static readonly CLASS_MASK_ALERT = "es-alert-mask";
    /**
     * Add a instance to cache, if no instance, show it
     * @param msg 
     * @param callback 
     */
    static add(msg: string, callback?: () => void) {
        C.instances.push({ msg: msg, callback: callback });
        if ($(".es-alert").length == 0) {
            C.show(msg);
        }
    }

    /**
     * @param msg 
     */
    static show(msg: string) {
        let htm = '';
        htm += '<div class="es-alert-mask"></div>\
                <div class="es-alert es-ani-slide-in-down">\
                    <div class="es-alert-msg"><span class="es-alert-icon iconfont icon-info-circle"></span>' + msg + '</div>\
                    <div class="es-alert-button-wrapper">\
                    <button id="myOkBtn" class="button es-alert-button btnWid1">OK</button>\
                    </div>\
                </div>';
        $("body").append(htm);
    }

    /**
     * Hide alerts
     */
    static hide() {
        $(".es-alert").remove();
        $(".es-alert-mask").remove();
    }

    static defaultInit() {
        let $LISTENER = $("body");
        if ($LISTENER.attr(C.ATTR_LISTEN_DISABLED) as any === false || $LISTENER.attr(C.ATTR_LISTEN_DISABLED) === undefined) {
            (window as any).alert = function (msg, callback?) {
                C.add(msg, callback);
            };
            $LISTENER.on("click", ".es-alert-button", function () {
                C.hide();
                if (isFunction(C.instances[0].callback)) {
                    C.instances[0].callback();
                }
                C.instances.shift();
                if (C.instances.length > 0) {
                    C.show(C.instances[0].msg);
                }
            });
        }
    }
    static isEventFrom(e) {
        return $(e.target).hasClass(C.CLASS_ROOT_ALERT)
            || $(e.target).parents("." + C.CLASS_ROOT_ALERT).length > 0
            || $(e.target).hasClass(C.CLASS_MASK_ALERT)
            || $(e.target).parents("." + C.CLASS_MASK_ALERT).length > 0;
    }
}

const C = EsAlertComponent;

export interface AlertMsg {
    msg: string;
    callback?: () => void;
}