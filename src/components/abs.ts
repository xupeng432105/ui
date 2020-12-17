export abstract class BaseComponent<T extends CommonCfg>
{
    cfg: T;
    rootElement: HTMLElement;
    rootCssClasses: string[];
    constructor(cfg: T) {
        return this;
    }
    abstract init(cfg: T): void;
}

export interface CommonCfg {
    customCssClasses?: string[];
}