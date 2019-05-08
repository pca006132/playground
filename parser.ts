enum ParserStatus {
    FAILED,
    INCOMPLETE,
    FINISHED
}

abstract class TreeNode {
    length: number;
    dirty: boolean;
    parent: CollectionNode | null;
    prev: TreeNode | null;
    next: TreeNode | null;

    abstract getFirstLeaf(): LeafNode | null;

    abstract prepend(n: LeafNode);

    insertAfter(node: TreeNode) {
        if (this.next == null && this.parent != null) {
            this.parent.lastChild = node;
        } else if (this.next != null){
            this.next.prev = node;
        }
        node.prev = this;
        node.next = this.next;
        node.parent = this.parent;
        this.next = node;

        if (this.parent)
            this.parent.length += node.length;
    }

    insertBefore(node: TreeNode) {
        if (this.prev == null && this.parent != null) {
            this.parent.firstChild = node;
        } else if (this.prev != null) {
            this.prev.next = node;
        }
        node.next = this;
        node.prev = this.prev;
        node.parent = this.parent;
        this.prev = node;

        if (this.parent)
            this.parent.length += node.length;
    }

    getNext(): TreeNode | null {
        if (this.next)
            return this.next;
        if (this.parent)
            return this.parent.getNext();
        return null;
    }

    getNextLeaf(): LeafNode | null {
        const result = this.getNext();
        if (result)
            return result.getFirstLeaf();
        return result;
    }

    remove() {
        if (this.next)
            this.next.prev = this.prev;
        else if (this.parent)
            this.parent.lastChild = this.prev;
        
        if (this.prev)
            this.prev.next = this.next;
        else if (this.parent)
            this.parent.firstChild = this.next;
        
        if (this.parent)
            this.parent.length -= this.length;
    }
}

abstract class CollectionNode extends TreeNode {
    firstChild: TreeNode | null;
    lastChild: TreeNode | null;   

    protected abstract parse_content(node?: TreeNode, fallback?: true): ParserStatus;

    getFirstLeaf() {
        if (this.firstChild)              
            return this.firstChild.getFirstLeaf();
        return null;
    }
    
    parse(node?: TreeNode, fallback?: true) {
        const result = this.parse_content(node, fallback);
        const next = this.getNext();
        switch (result) {
            case ParserStatus.FAILED:
                if (this.parent)
                    this.parent.parse(this, true);
                return;
            case ParserStatus.INCOMPLETE:
                //the last one must be leafnode in this case
                const n = this.lastChild as LeafNode;
                n.remove();
                if (next) {
                    next.prepend(n);
                    next.dirty = true;
                }
                break;
            case ParserStatus.FINISHED:
                break;
        }
        if (next && next instanceof CollectionNode)
            next.parse();   
        if (this.parent)
            this.parent.parse(this);
    }

    prepend(n: LeafNode) {
        if (this.firstChild) {
            this.firstChild.insertBefore(n);
        } else {
            this.firstChild = this.lastChild = n;
            n.parent = this;
        }
    }
}

class LeafNode extends TreeNode {
    text: string;

    constructor(text: string) {
        super();
        this.text = text;
    }

    getFirstLeaf() {
        return this;
    }

    prepend(n: LeafNode) {
        this.text = n.text + this.text;
    }
}
