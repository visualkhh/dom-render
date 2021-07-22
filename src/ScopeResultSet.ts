import {ScopeObject, ScopeObjectCalls} from './ScopeObject';
import {eventManager} from './events/EventManager';
import {RootScope, TargetNode, TargetNodeMode} from './RootScope';
import {ScopeFectory} from './fectorys/ScopeFectory';
import {NodeUtils} from './utils/node/NodeUtils';

export class ScopeResultSet {
    // eslint-disable-next-line no-undef
    public childNodes: ChildNode[];
    constructor(public uuid: string, public object: ScopeObject, public fragment: DocumentFragment, public startComment: Comment, public endComment: Comment, public calls: ScopeObjectCalls[] = []) {
        // console.log('----->fragment', fragment.childNodes)
        // eslint-disable-next-line no-undef
        this.childNodes = [];
        for (let i = 0; i < fragment.childNodes.length; i++) {
            const childNode = fragment.childNodes[i];
            this.childNodes.push(childNode);
        }
    }

    public childAllRemove() {
        // this.startComment.remove();
        // this.childNodes.forEach(it => {
        //     it.remove();
        // })
        // this.endComment.remove();
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
    }
}
