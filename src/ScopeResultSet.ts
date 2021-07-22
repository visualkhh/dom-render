import {ScopeObject, ScopeObjectCalls} from './ScopeObject';
import {eventManager} from './events/EventManager';
import {RootScope, TargetNode, TargetNodeMode} from './RootScope';
import {ScopeFectory} from './fectorys/ScopeFectory';
import {NodeUtils} from './utils/node/NodeUtils';

export class ScopeResultSet {
    // eslint-disable-next-line no-undef
    public childNodes: ChildNode[];
    constructor(public uuid: string, public object: ScopeObject, public fragment: DocumentFragment, public startComment: Comment, public endComment: Comment, public calls: ScopeObjectCalls = []) {
        // console.log('----->fragment', fragment.childNodes)
        // eslint-disable-next-line no-undef
        this.childNodes = [];
        for (let i = 0; i < fragment.childNodes.length; i++) {
            const childNode = fragment.childNodes[i];
            this.childNodes.push(childNode);
        }
    }

    public childAllRemove() {
        let next = this.startComment.nextSibling;
        while (next) {
            if (next === this.endComment) {
                break;
            }
            next.remove();
            next = this.startComment.nextSibling;
        }
    }

    public applyEvent() {
        eventManager.applyEvent(this.object._originObj, this.childNodes);

        const includeScopeAttrName = 'include-scope-uuid';
        this.childNodes.filter(it => it instanceof Element)
            .map(it => it as Element)
            .filter(it => it.getAttribute(includeScopeAttrName))
            .forEach(it => {
                const uuid = it.getAttribute(includeScopeAttrName)!;
                // console.log('--fffffff->', this.object, this.object._originObj)
                for (const [key, value] of Object.entries(this.object._originObj)) {
                    if (value instanceof ScopeFectory) {
                        console.log('uuid-->', uuid)
                        // it.remove()
                        const fragment = value.executeFragment(uuid)
                        // it.setAttribute('date', new Date().toString())
                        // alert(1)
                        // console.log('--->', uuid, value, it, fragment.childNodes)
                        // fragment.childNodes.forEach((it: any) => {
                        //     console.log('child----->', it)
                        // })
                        // it.appendChild(document.createComment('------'))
                        if (fragment) {
                            // it.parentNode?.replaceChild(document.createElement('div'), it);
                            // NodeUtils.replaceNode(it, document.createElement('div'))
                            // NodeUtils.replaceNode(it, fragment)
                            // console.log('------>', fragment, fragment.childNodes)
                            // NodeUtils.appendChild(it, fragment)
                            NodeUtils.replaceNode(it, fragment)
                            // NodeUtils.replaceNode(it, document.createElement('div'))
                            // console.log('------>', fragment, fragment.childNodes)
                        }
                        //console.log('sskeys-->', key, value)
                    }
                }
            })

        // eventManager.attrNames.forEach(it => {
        //     this.childNodes.forEach(eit => {
        //
        //     })
        // })
    }
}
