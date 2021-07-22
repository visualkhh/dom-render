import {eventManager} from "./events/EventManager";

export class ScopeRawSet {
    public node: DocumentFragment | Node;
    public usingVars: string[] = [];

    constructor(public document: Document, public raw: string | Node, public styles: string[] = []) {
        if (typeof this.raw === 'string') {
            const template = this.document.createElement('template');
            template.innerHTML = this.raw;
            this.node = template.content
        } else {
            this.node = this.raw;
        }
        this.usingVars = this.usingThisVar(this.node.textContent ?? '');
    }

    // remakeNode() {
    //
    // }

    findScopeComment() {
        const nodeIterator = this.document.createNodeIterator(
            this.node,
            // https://developer.mozilla.org/ko/docs/Web/API/Document/createTreeWalker
            // NodeFilter.SHOW_COMMENT: 128
            128,
            {
                acceptNode: (node: Comment) => {
                    const coment = (node as Comment).data.replace(/[\r\n]/g, '');
                    const b = (coment.startsWith('%') && coment.endsWith('%') && node !== this.node);
                    // NodeFilter.FILTER_ACCEPT: 1, NodeFilter.FILTER_REJECT: 2
                    return b ? 1 : 2;
                }
            }
        )
        return nodeIterator;
    }

    public getScopeCommentData() {
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
        // Node.COMMENT_NODE: 8, Node.DOCUMENT_FRAGMENT_NODE: 11
        // console.log('-', this.node, this.node.nodeType)
        if (this.node.nodeType === 8) {
            const comment = (this.node as Comment).data
            if (comment.startsWith('%') && comment.endsWith('%')) {
                return comment.substring(1, comment.length - 1)
            }
        }
    }

    private usingThisVar(raws: string): string[] {
        return eventManager.usingThisVar(raws)
        // const regex = /["'].*["']/gm;
        // raws = raws.replace(regex, '');
        // const varRegexStr = 'this\\.([a-zA-Z_$][a-zA-Z_.$0-9]*)';
        // const varRegex = RegExp(varRegexStr, 'gm');
        // let varExec = varRegex.exec(raws)
        // const usingVars = [];
        // while (varExec) {
        //     usingVars.push(varExec[1]);
        //     varExec = varRegex.exec(varExec.input)
        // }
        // return usingVars;
    }
}
