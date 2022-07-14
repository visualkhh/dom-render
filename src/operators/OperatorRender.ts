import {RawSet} from '../rawsets/RawSet';
import {ComponentSet} from '../components/ComponentSet';
import {Config} from '../configs/Config';
import {Attrs} from '../rawsets/Attrs';
import {AttrInitCallBack} from '../rawsets/AttrInitCallBack';
import {ElementInitCallBack} from '../rawsets/ElementInitCallBack';
import {Render} from '../rawsets/Render';
export enum ExecuteState {
    EXECUTE,
    NO_EXECUTE,
    STOP
}
export type AfterCallBack = {onAttrInitCallBacks: AttrInitCallBack[],
    onElementInitCallBacks: ElementInitCallBack[],
    onThisComponentSetCallBacks: ComponentSet[]}
export abstract class OperatorRender {
    constructor(public rawSet: RawSet, public render: Render,
                public returnContainer: {raws: RawSet[], fag: DocumentFragment},
                public elementSource: {element: Element, attrs: Attrs},
                public source: {config: Config, obj: any},
                public afterCallBack: AfterCallBack) {
    }

    abstract execRender(): ExecuteState;
}