import {AttrInitCallBack} from '../rawsets/AttrInitCallBack';
import {ElementInitCallBack} from '../rawsets/ElementInitCallBack';
import {ComponentSet} from '../components/ComponentSet';
import {RawSet} from '../rawsets/RawSet';
import {Render} from '../rawsets/Render';
import {Attrs} from '../rawsets/Attrs';
import {Config} from '../configs/Config';
import {ScriptUtils} from '../utils/script/ScriptUtils';

export type OperatorAround = {
    beforeAttr?: (value: string | null | undefined, obj: any) => string | null | undefined,
    before?: (data: any, obj: any) => any,
    after?: (data: any, obj: any) => void,
}

export enum ExecuteState {
    EXECUTE,
    NO_EXECUTE,
    STOP
}

export type AfterCallBack = {
    onAttrInitCallBacks: AttrInitCallBack[],
    onElementInitCallBacks: ElementInitCallBack[],
    onThisComponentSetCallBacks: ComponentSet[]
}
export type ReturnContainer = { raws: RawSet[], fag: DocumentFragment };

export type ElementSource = { element: Element, attrs: Attrs, attr?: string | null };

export type Source = { config: Config, operatorAround?: OperatorAround, obj: any};

export abstract class OperatorExecuter<T> {
    constructor(public rawSet: RawSet, public render: Render,
                public returnContainer: ReturnContainer,
                public elementSource: ElementSource,
                public source: Source,
                public afterCallBack: AfterCallBack,
                public startingExecute = true) {
    };

    start(): ExecuteState {
        let attrValue = this.elementSource.attr;
        if (this.source.operatorAround?.beforeAttr) {
            attrValue = this.source.operatorAround.beforeAttr(attrValue, this.source.obj) ?? '';
        }

        let r = attrValue;
        if (r && this.startingExecute) {
            r = ScriptUtils.eval(` ${this.render.bindScript}; return ${attrValue}`, this.source.obj);
        }
        if (this.source.operatorAround?.before) {
            r = this.source.operatorAround?.before(r, this.source.obj);
        }

        const state = this.execute(r as unknown as T)

        this.source.operatorAround?.after?.(r, this.source.obj);
        return state;
    };

    abstract execute(value: T): ExecuteState;
}
