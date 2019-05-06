/**
 * Implementation of Cons list
 */

export class Cons<A> {
    private item: A;
    private next: Cons<A>;
    constructor(item: A, next: Cons<A> = null) {
        this.item = item;
        this.next = next;
    }
    car = ()=>this.item;
    cdr = ()=>this.next;
}

export function cons<A>(item: A, next: Cons<A> = null) {
    return new Cons<A>(item, next);
}

export function toCons<A>(items: A[], index = 0) {
    if (items.length - index > 0)
        return cons<A>(items[index], toCons(items, index + 1));
    return null;
}
