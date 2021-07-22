import {Scope} from './Scope';
import {ScopeRawSet} from './ScopeRawSet';
import {ScopeResultSet} from './ScopeResultSet';
import {RandomUtils} from './utils/random/RandomUtils';
import {NodeUtils} from './utils/node/NodeUtils';
import {Config} from './Config';
import {eventManager} from './events/EventManager';
import {ChangeField} from './ChangeField';
import {ScopeObject} from './ScopeObject';
import {ScopeOpjectProxy} from './proxys/ScopeOpjectProxy';
import {ScopeOption} from './ScopeOption';

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

export class RootScope extends Scope implements ChangeField {
    constructor(raws: ScopeRawSet, obj: any, uuid = RandomUtils.uuid(), config = new Config(), public targetNode = new TargetNode(raws.document)) {
        super(raws, obj, uuid, config);
        // console.log(this.childs)
    }

    changeField(path: string): void {
        // 수정 포인트.
        // eventManager.changeVar(this.obj, [this.targetNode.node as Element])
        // const template = this.config.document.createElement('template');
        // this?.scopeResult?.childNodes.forEach(it => {
        //     // template.appendChild(it);
        // })
        // console.log(this?.scopeResult, template.content)
        // template.append(this?.scopeResult?.childNodes ?? []);
    }

    executeRender(option?: ScopeOption) {
        this.executeFragment(option);
        if (this.obj.onReady) {
            this.obj.onReady(this.raws.node);
        }
        console.log(this.raws.node, this.targetNode)
        if (this.targetNode.node && TargetNodeMode.child === this.targetNode.mode) {
            NodeUtils.removeAllChildNode(this.targetNode.node)
            NodeUtils.appendChild(this.targetNode.node, this.raws.node)
        } if (this.targetNode.node && TargetNodeMode.appendChild === this.targetNode.mode) {
            NodeUtils.appendChild(this.targetNode.node, this.raws.node)
        } if (this.targetNode.node && TargetNodeMode.prepend === this.targetNode.mode) {
            (this.targetNode.node as any)?.prepend(this.raws.node)
        } else if (this.targetNode.node && TargetNodeMode.replace === this.targetNode.mode) {
            NodeUtils.replaceNode(this.targetNode.node, this.raws.node)
        } else {
            // nothing..
        }
        if (this.obj.onRenderd) {
            this.obj.onRenderd(this.raws.node);
        }
        this.executeChildResultSet(option);
        return this.targetNode;
    }

    execRoot(fragment: DocumentFragment) {
        // eslint-disable-next-line no-undef
        // const childNodes: ChildNode[] = [];
        // const startComment = this.config.document.createComment('rootScope start');
        // const endComment = this.config.document.createComment('rootScope end');
        // eventManager.findAttrElements(fragment).forEach(it => {
        //     childNodes.push(it.element)
        // })
        // const scopeObject = new ScopeObject(this.config);
        // scopeObject._originObj = this.obj;
        // const object = new Proxy(scopeObject, new ScopeOpjectProxy(this.obj))
        // this.scopeResult = new ScopeResultSet(RandomUtils.uuid(), object, fragment, startComment, endComment);
        // this.scopeResult.childNodes = childNodes;
        // this.scopeResult.applyEvent();
        // if (this.obj.onScopeMaked) {
        //     this.obj.onScopeMaked(this);
        // }
    }

    executeFragment(option?: ScopeOption) {
        // this.execRoot(this.raws.node);

        // eventManager.applyEvent(this.obj, templateElement);
        // console.log('executeFragment ', rawFragment.childNodes.length)
        this.childs.forEach(it => {
            const childScopeObject = it.exec().result;
            it.raws.node.parentNode?.appendChild(childScopeObject.startComment);
            it.raws.node.parentNode?.appendChild(childScopeObject.fragment);
            it.raws.node.parentNode?.appendChild(childScopeObject.endComment);
            // const childScopeObject = it.scopeResult!
            // const currentNode = this.extracted(rawFragment, it, childScopeObject);
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
            // childScopeObject.fragment.childNodes.forEach(it => {
            //     console.log('childnodes--->', it)
            // })
            // currentNode?.parentNode?.replaceChild(childScopeObject.fragment, currentNode);

            /*
                let currentNode = nodeIterator.nextNode();
                while (currentNode = nodeIterator.nextNode()) {...}
             */
        });

        // styles
        // if (this.rawSet.styles.length > 0) {
        //     const styleScope = new RootScope(new ScopeRawSet(this.rawSet.styles.join(' ')), this.obj, RandomUtils.uuid(), this.config); // , {start: '/*%', end: '%*/'};
        //     const styleFragment = styleScope.executeFragment();
        //     styleScope.childs.forEach(it => this.childs.push(it));
        //     const style = this.config.document.createElement('style');
        //     style.appendChild(styleFragment);
        //     rawFragment.prepend(style);
        // }
        // if (option?.childElementAttr && option?.childElementAttr?.size > 0) {
        //     rawFragment.childNodes.forEach((it) => {
        //         // Node.ELEMENT_NODE
        //         if (it.nodeType === 1) {
        //             option?.childElementAttr?.forEach((v, k) => {
        //                 (it as Element).setAttribute(k, v);
        //             })
        //         }
        //     })
        // }
        // return rawFragment;
    }

    private executeChildResultSet(option: ScopeOption | undefined) {
        this.childs.forEach(it => {
            it.scopeResult?.calls.filter(it => it.name === 'include' && it.result instanceof RootScope).map(it => it.result as RootScope).forEach(it => {
                it.executeRender();
            })
        });
    }
    // private extracted(rawFragment: DocumentFragment, it: Scope, childScopeObject: ScopeResultSet) {
    //     const nodeIterator = this.raws.document.createNodeIterator(
    //         rawFragment,
    //         // https://developer.mozilla.org/ko/docs/Web/API/Document/createTreeWalker
    //         // NodeFilter.SHOW_COMMENT: 128
    //         128,
    //         {
    //             acceptNode: (node: Comment) => {
    //                 const coment = (node as Comment).data.replace(/[\r\n]/g, '');
    //                 const b = coment.startsWith('%') && coment.endsWith('%') && coment === ('%' + it.raws.replace(/[\r\n]/g, '') + '%');
    //                 // NodeFilter.FILTER_ACCEPT: 1, NodeFilter.FILTER_REJECT: 2
    //                 return b ? 1 : 2;
    //             }
    //         }
    //     )
    //
    //     const currentNode = nodeIterator.nextNode();
    //     currentNode?.parentNode?.insertBefore(childScopeObject.startComment, currentNode);
    //     currentNode?.parentNode?.insertBefore(childScopeObject.endComment, currentNode.nextSibling);
    //     return currentNode;
    // }

}
