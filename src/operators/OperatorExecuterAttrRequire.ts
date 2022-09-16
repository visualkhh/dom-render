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

    async execute(data: T): Promise<ExecuteState> {
        if (!this.elementSource.attr) {
            return ExecuteState.NO_EXECUTE;
        }
        return await this.executeAttrRequire(data);
    }

    protected abstract executeAttrRequire(attr: T): Promise<ExecuteState>;
}
