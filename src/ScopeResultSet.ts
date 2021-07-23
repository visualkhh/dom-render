import {ScopeObject} from './ScopeObject';
import {eventManager} from './events/EventManager';
import {ScopeObjectCall} from './ScopeObjectCall';

export class ScopeResultSet {
    // eslint-disable-next-line no-undef
    public childNodes: ChildNode[];
    constructor(public uuid: string, public object: ScopeObject, public fragment: DocumentFragment, public startComment: Comment, public endComment: Comment, public calls: ScopeObjectCall[] = []) {
        // console.log('----->fragment', fragment.childNodes)
        // eslint-disable-next-line no-undef
        this.childNodes = [];
        for (let i = 0; i < fragment.childNodes.length; i++) {
            const childNode = fragment.childNodes[i];
            // console.log('--->', uuid,  childNode)
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

    public isConnected() {
        // console.log('--->isConnected', this.childNodes)
        if (this.childNodes.length <= 0) {
            return true;
        }
        for (const childNode of this.childNodes) {
            // console.log('isCOnnected-->', childNode)
            if (childNode.isConnected) {
                return true;
            }
        }
        return false;
    }

    public applyEvent() {
        eventManager.applyEvent(this.object._originObj, this.childNodes);
    }
}
