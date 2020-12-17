import { isFunction } from "../utils";

export class EsConfirmComponent {
    static instances: ConfirmMsg[] = [];
    static readonly CLASS_ROOT_CONFIRM = "es-confirm";
    static readonly CLASS_MASK_CONFIRM = "es-confirm-mask";

    /**
     * Add a instance to cache, if no instance, show it
     * @param msg 
     * @param ok 
     * @param cancel 
     * @param groupId 
     */
    static add(msg: string, ok?: () => void, cancel?: () => void, groupId?: string) {
        C.instances.push({ msg: msg, ok: ok, cancel: cancel, groupId: groupId });
        if ($(".es-confirm").length == 0) {
            C.show(msg);
        }
    }

    /**
     * 
     * @param msg 
     */
    static show(msg: string) {
        let htm = '';
        htm += '<div class="es-confirm-mask"></div>\
                <div class="es-confirm es-ani-slide-in-down">\
                    <div class="es-confirm-msg"><span class="es-confirm-icon iconfont icon-ques"></span>' + msg + '</div>\
                    <div class="es-confirm-button-wrapper">\
                        <button id="myOkBtn" class="button es-confirm-ok btnWid1">OK</button>\
                        <button class="button-bordered es-confirm-cancel btnWid1">Cancel</button>\
                    </div>\
                </div>';
        $("body").append(htm);
    }

    /**
     * Hide confirms
     */
    static hide() {
        $(".es-confirm-mask").remove();
        $(".es-confirm").remove();
    }

    static isEventFrom(e) {
        return $(e.target).hasClass(C.CLASS_ROOT_CONFIRM)
            || $(e.target).parents("." + C.CLASS_ROOT_CONFIRM).length > 0
            || $(e.target).hasClass(C.CLASS_MASK_CONFIRM)
            || $(e.target).parents("." + C.CLASS_MASK_CONFIRM).length > 0;
    }

    static defaultInit() {
        $("body").on("click", ".es-confirm-ok", function () {
            C.hide();
            if (isFunction(C.instances[0].ok)) {
                C.instances[0].ok();
            }
            C.instances.shift();
            if (C.instances.length > 0) {
                C.show(C.instances[0].msg);
            }
            C.groupCompleteCheck.doAllCheck();
        });
        $("body").on("click", ".es-confirm-cancel", function () {
            C.hide();
            if (isFunction(C.instances[0].cancel)) {
                C.instances[0].cancel();
            }
            C.instances.shift();
            if (C.instances.length > 0) {
                C.show(C.instances[0].msg);
            }
            C.groupCompleteCheck.doAllCheck();
        });
    }

    /**
    * ```
    * ESCMS.confirm("1",null,null,"g1");
    * ESCMS.confirm("2",null,null,"g1");
    * ESCMS.onConfirmGroupComplete("g1",function(){console.log(2)});
    * ```
    */
    static groupCompleteCheck = {
        /**
         * @internal
         */
        items: [],
        add: function (groupId: number | string, onComplete: () => void) {
            C.groupCompleteCheck.items.push({
                groupId: groupId,
                func: function () {
                    for (let i = 0; i < C.instances.length; i++) {
                        if (C.instances[i].groupId == groupId)
                            return false;
                    }
                    if (isFunction(onComplete))
                        onComplete();
                    C.groupCompleteCheck.remove(groupId);
                }
            })
        },
        /**
         * @internal
         */
        remove: function (groupId: number | string) {
            for (let i = 0; i < C.groupCompleteCheck.items.length; i++) {
                if (C.groupCompleteCheck.items[i].groupId == groupId)
                    C.groupCompleteCheck.items.splice(i, 1);
            }
        },
        /**
         * @internal
         */
        doAllCheck: function () {
            for (let i = 0; i < C.groupCompleteCheck.items.length; i++) {
                C.groupCompleteCheck.items[i].func();
            }
        }
    }
}

const C = EsConfirmComponent;

export interface ConfirmMsg {
    msg: string;
    ok?: () => void,
    cancel: () => void,
    groupId: string | number
}