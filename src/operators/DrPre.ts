import {AfterCallBack, ElementSource, ExecuteState, OperatorExecuter, ReturnContainer, Source} from './OperatorExecuter';
import {RawSet} from '../rawsets/RawSet';
import {Render} from '../rawsets/Render';

export class DrPre extends OperatorExecuter<null> {
    constructor(rawSet: RawSet, render: Render, returnContainer: ReturnContainer, elementSource: ElementSource, source: Source, afterCallBack: AfterCallBack) {
        source.operatorAround = undefined;
        super(rawSet, render, returnContainer, elementSource, source, afterCallBack);
    }

    async execute(value: null): Promise<ExecuteState> {
        return (value != null) ? ExecuteState.EXECUTE : ExecuteState.NO_EXECUTE;
    }
}
