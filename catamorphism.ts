import { Cons , cons , toCons} from './cons';

function cata<A, B>(b: B, op: (A, B)=>B) {
    const h = (cons: Cons<A> | null) => {
        return (cons == null)?
            b :
            op(cons.car(), h(cons.cdr()))
    }
    return h;
}

//test
const list = toCons(['a', 'bc', 'def', 'ghij', 'lmnop']);

//sum
const h1 = cata<string, number>(0, (a, b)=>a.length + b);
console.log(h1(list));

//filter
const h2 = cata<string, Cons<string>|null>(null, (a, b)=>(a.length % 2)? cons(a, b) : b);
console.log(h2(list));
