import {RawSet} from '../rawsets/RawSet';
import {Render} from '../rawsets/Render';
import {AfterCallBack, ElementSource, ExecuteState, OperatorExecuter, ReturnContainer, Source} from './OperatorExecuter';

export abstract class OperatorExecuterAttrRequire<T> extends OperatorExecuter<T> {
    constructor(rawSet: RawSet, render: Render,
                returnContainer: ReturnContainer,
                elementSource: ElementSource,
                source: Source,
                afterCallBack: AfterCallBack,
                startingExecute = true) {
        super(rawSet, render, returnContainer, elementSource, source, afterCallBack, startingExecute);
    };

    execute(data: T): ExecuteState {
        if (!this.elementSource.attr) {
            return ExecuteState.NO_EXECUTE;
        }
        return this.executeAttrRequire(data);
    }

    protected abstract executeAttrRequire(attr: T): ExecuteState;
}
