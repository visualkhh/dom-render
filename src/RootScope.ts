import {Scope} from './Scope';
import {ScopePosition} from './ScopePosition';
import {ScopeRawSet} from './ScopeRawSet';
import {ScopeResultSet} from './ScopeResultSet';
import {RandomUtils} from './utils/random/RandomUtils';
import {NodeUtils} from './utils/node/NodeUtils';
import {Config} from './Config';

export enum TargetNodeMode {
    // eslint-disable-next-line no-unused-vars
    child = 'child',
    // eslint-disable-next-line no-unused-vars
    appendChild = 'appendChild',
    // eslint-disable-next-line no-unused-vars
    prepend = 'prepend',
    // eslint-disable-next-line no-unused-vars
    replace = 'replace'
}

export class TargetNode {
    constructor(private _node: Node | string = document.body, public mode = TargetNodeMode.child) {
    }

    get node(): Node | Element | null {
        if (typeof this._node === 'string') {
            return document.querySelector(this._node);
        } else {
            return this._node;
        }
    }
}

export class RootScope extends Scope {
    constructor(public rawSet: ScopeRawSet, obj: any, uuid = RandomUtils.uuid(), config = new Config(), public targetNode = new TargetNode(config.document), position: ScopePosition = new ScopePosition(0, rawSet.raw.length)) {
        super(rawSet.raw, obj, uuid, config, position);
    }

    executeRender(option?: {head?: Node, tail?: Node, childElementAttr?: Map<string, string>}) {
        const fragment = this.executeFragment(option);
        if (this.targetNode.node && TargetNodeMode.child === this.targetNode.mode) {
            NodeUtils.removeAllChildNode(this.targetNode.node)
            NodeUtils.appendChild(this.targetNode.node, fragment)
        } if (this.targetNode.node && TargetNodeMode.appendChild === this.targetNode.mode) {
            NodeUtils.appendChild(this.targetNode.node, fragment)
        } if (this.targetNode.node && TargetNodeMode.prepend === this.targetNode.mode) {
            (this.targetNode.node as any)?.prepend(fragment)
        } else if (this.targetNode.node && TargetNodeMode.replace === this.targetNode.mode) {
            NodeUtils.replaceNode(this.targetNode.node, fragment)
        } else {
            // nothing..
        }
        return this.targetNode;
    }

    executeFragment(option?: {head?: Node, tail?: Node, childElementAttr?: Map<string, string>}) {
        const templateElement = this.config.document.createElement('template');
        templateElement.innerHTML = this.raws;
        const rawFragment = templateElement.content;
        // console.log('executeFragment ', rawFragment.childNodes.length)
        this.childs.forEach(it => {
            const childScopeObject = it.exec().result;
            // const childScopeObject = it.scopeResult!
            const currentNode = this.extracted(rawFragment, it, childScopeObject);
            // childScopeObject.fragment.childNodes.forEach(it => {
            //     if (it.nodeType === Node.ELEMENT_NODE) {
            //         (it as Element).setAttribute('module-id', this.uuid);
            //     }
            // })
            if (option?.head) {
                childScopeObject.fragment.prepend(option?.head)
            }
            if (option?.tail) {
                childScopeObject.fragment.append(option?.tail)
            }
            currentNode?.parentNode?.replaceChild(childScopeObject.fragment, currentNode);
            /*
                let currentNode = nodeIterator.nextNode();
                while (currentNode = nodeIterator.nextNode()) {...}
             */
        });

        // styles
        if (this.rawSet.styles.length > 0) {
            const styleScope = new RootScope(new ScopeRawSet(this.rawSet.styles.join(' ')), this.obj, RandomUtils.uuid(), this.config); // , {start: '/*%', end: '%*/'};
            const styleFragment = styleScope.executeFragment();
            styleScope.childs.forEach(it => this.childs.push(it));
            const style = this.config.document.createElement('style');
            style.appendChild(styleFragment);
            rawFragment.prepend(style);
        }
        if (option?.childElementAttr && option?.childElementAttr?.size > 0) {
            rawFragment.childNodes.forEach((it) => {
                // Node.ELEMENT_NODE
                if (it.nodeType === 1) {
                    option?.childElementAttr?.forEach((v, k) => {
                        (it as Element).setAttribute(k, v);
                    })
                }
            })
        }
        return rawFragment;
    }

    private extracted(rawFragment: DocumentFragment, it: Scope, childScopeObject: ScopeResultSet) {
        const nodeIterator = this.config.document.createNodeIterator(
            rawFragment,
            // https://developer.mozilla.org/ko/docs/Web/API/Document/createTreeWalker
            // NodeFilter.SHOW_COMMENT: 128
            128,
            {
                acceptNode: (node: Comment) => {
                    const coment = (node as Comment).data.replace(/[\r\n]/g, '');
                    const b = coment.startsWith('%') && coment.endsWith('%') && coment === ('%' + it.raws.replace(/[\r\n]/g, '') + '%');
                    // NodeFilter.FILTER_ACCEPT: 1, NodeFilter.FILTER_REJECT: 2
                    return b ? 1 : 2;
                }
            }
        )

        const currentNode = nodeIterator.nextNode();
        currentNode?.parentNode?.insertBefore(childScopeObject.startComment, currentNode);
        currentNode?.parentNode?.insertBefore(childScopeObject.endComment, currentNode.nextSibling);
        return currentNode;
    }
}
