export interface Option<T> {
    unwrap(): T;
    map<T1>(fn: (v: T) => T1): Option<T1>;
    mapOr<T1>(fn: (v: T) => T1, fn2: () => T1): Option<T1>;
    exist(): boolean;
}

export class Some<T> implements Option<T> {
    private v: T;
    constructor (v: T) {
        this.v = v;
    }

    unwrap() {
        return this.v;
    }

    map<T1>(fn: (v: T) => T1): Option<T1> {
        return new Some(fn(this.v));
    }

    mapOr<T1>(fn: (v: T) => T1, fn2: () => T1): Option<T1> {
        return this.map(fn);
    }

    exist() {
        return true;
    }
}

export class None<T> implements Option<T> {
    unwrap(): T {
        throw new Error('unwrapping nothing.');
    }

    map<T1>(fn: (v: T) => T1): Option<T1> {
        return new None<T1>();
    }

    mapOr<T1>(fn: (v: T) => T1, fn2: () => T1): Option<T1> {
        return new Some(fn2());
    }

    exist() {
        return false;
    }
}
