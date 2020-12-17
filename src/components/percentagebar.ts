import { mergeCfg } from "../utils";

/**
 * A processbar component
 * ```
 * new ESCMS.percentageBar({
 *		$targetElement: $("#processCpuUsage"),
 *		value: "30%"
 *	})
 * ```
 */
export class EsPercentageBarComponent {
    cfg: EsPercentageBarComponentCfg;
    $rootElement: JQuery;
    itemComps: EsPercentageBarItemComponent[] = [];
    constructor(cfg: EsPercentageBarComponentCfg) {
        this.init(cfg);
    }

    init(cfg: EsPercentageBarComponentCfg) {
        this.mergeCfg(this, cfg);
        this.itemComps = [];
        this.generateHTML();
    }
    generateHTML() {
        let self = this;
        let htm = "";
        htm += "<div class=\"es-processbar\" " + (this.cfg.title ? "title=\"" + this.cfg.title + "\"" : "") + " style=\"width:" + this.cfg.width + ";height:" + this.cfg.height + "\">"
        htm += "        <div class=\"es-processbar-background\"><\/div>";
        for (let i = 0; i < this.cfg.items.length; i++) {
            let item = this.cfg.items[i];
            let itemComp = new EsPercentageBarItemComponent({
                name: item.name,
                value: item.value,
                color: item.color,
                left: this.calcLeft(this, i) + "%",
                title: item.title,
                colorChange: item.colorChange
            });
            this.itemComps.push(itemComp);
            htm += itemComp.generateHTML();
        }
        htm += "</div>";
        this.cfg.$targetElement.html(htm);
        this.$rootElement = this.cfg.$targetElement.find(".es-processbar");
        this.$rootElement.find(".es-processbar-main").each(function (i) {
            $(this).width(self.cfg.items[i].value);
        });
    }
    refresh(cfg) {
        this.cfg = mergeCfg(this.cfg, cfg);
        this.generateHTML();
    }

    private mergeCfg(instance: EsPercentageBarComponent, cfg: EsPercentageBarComponentCfg) {
        let defaultCfg = {
            $targetElement: "",
            items: [{
                name: "",
                value: "0%",
                color: "#3e49fb",
                title: false,
                colorChange: false
            }],
            title: false,
            width: "100%",
            height: "26px"
        };
        instance.cfg = mergeCfg(defaultCfg, cfg);
    }
    private calcLeft(instance: EsPercentageBarComponent, index): number {
        let left = 0;
        for (let i = 0; i < index; i++) {
            let item = instance.cfg.items[i];
            let val = item.value.split("%")[0];
            left += Number(val);
        }
        return left;
    }
}

export class EsPercentageBarItemComponent {
    cfg: EsPercentageBarItemComponentCfg;
    constructor(cfg: EsPercentageBarItemComponentCfg) {
        this.mergeCfg(this, cfg);
        this.generateHTML();
    }

    init(cfg: EsPercentageBarItemComponentCfg) {
        mergeCfg(this, cfg);
        this.generateHTML();
    }

    generateHTML() {
        let htm = "";
        let statusClass = "default";
        let value_number = Number(this.cfg.value.split("%")[0]);
        if (this.cfg.colorChange) {
            if (value_number > 60 && value_number < 90) {
                statusClass = "warn";
            }
            else if (value_number >= 90) {
                statusClass = "error";
            }
        }
        htm += "<div " + (this.cfg.title ? ("title=\"" + this.cfg.title + "\"") : "") + " class=\"es-processbar-main " + statusClass + "\" style=\"width:0; left:" + this.cfg.left + "; background-color:" + this.cfg.color + "\"><\/div>";
        return htm;
    }

    private mergeCfg(instance, cfg: EsPercentageBarItemComponentCfg) {
        let defaultCfg = {
            name: "",
            value: "0%",
            color: "#3e49fb",
            left: "0%",
            title: false,
            colorChange: false
        };
        instance.cfg = mergeCfg(defaultCfg, cfg);
    }
}

export interface EsPercentageBarComponentCfg {
    $targetElement: JQuery;
    items: EsPercentageBarItemComponentCfg[];
    title?: false | string;
    width?: string;
    height?: string
}

export interface EsPercentageBarItemComponentCfg {
    name?: string;
    value: string;
    color?: string;
    title?: false | string;
    colorChange?: boolean;
    left?: string
}

