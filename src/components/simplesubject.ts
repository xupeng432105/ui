import { isFunction } from "../utils";

/**
 * A simple subject like rxjs.
 */
export class SimpleSubject {
    subscribers: Subscriber[] = [];
    constructor() { }
    subscribe(cb: (val) => void) {
        const s = new Subscriber(this, cb);
        this.subscribers.push(s);
        return s;
    }
    unsubscribe(subscriber: Subscriber) {
        this.subscribers.forEach((s, i) => {
            if (s == subscriber)
                this.subscribers.splice(i);
        })
    }
    next(val) {
        this.subscribers.forEach(s => {
            if (isFunction(s.cb))
                s.cb(val);
        })
    }
}

class Subscriber {
    cb;
    private subject: SimpleSubject;
    constructor(subject: SimpleSubject, cb: (val) => void) {
        this.subject = subject;
        this.cb = cb;
    };
    unsubscribe() {
        this.cb = null;
        this.subject.unsubscribe(this);
    }
}