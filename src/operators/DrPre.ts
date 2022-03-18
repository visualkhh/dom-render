import {ExecuteState, OperatorRender} from './OperatorRender';

export class DrPre extends OperatorRender {
    execRender(): ExecuteState {
        return (this.elementSource.attrs.drPre != null) ? ExecuteState.EXECUTE : ExecuteState.NO_EXECUTE;
    }
}