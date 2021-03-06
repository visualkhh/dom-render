import {ExecuteState, OperatorRender} from './OperatorRender';
import {ScriptUtils} from '../utils/script/ScriptUtils';
import {RawSet} from '../rawsets/RawSet';
import {Validator} from '../validators/Validator';
import {EventManager} from '../events/EventManager';
import {ValidatorArray} from '../validators/ValidatorArray';
import {Render} from '../rawsets/Render';

export class DrForm extends OperatorRender {
    execRender(): ExecuteState {
        if (this.elementSource.attrs.drForm) {
            RawSet.drFormOtherMoveAttr(this.elementSource.element, 'name', 'temp-name', this.source.config);
            const data = ScriptUtils.evalReturn(`${this.elementSource.attrs.drForm}`, this.source.obj);

            const childs = Array.from(this.elementSource.element.querySelectorAll('[name]'));

            const fromName = ScriptUtils.evalReturn(this.elementSource.element.getAttribute('dr-form:name') ?? '', this.source.obj);
            const thisName = fromName ?? this.elementSource.element.getAttribute('name');
            // console.log('dr-form:name', thisName, element.getAttribute('dr-form:name'), obj, element);
            // // 자기자신이 Input 대상일때
            if (childs.length <= 0 && thisName) {
                childs.push(this.elementSource.element);
            } else {
                if (data instanceof Validator) {
                    data.setTarget(this.elementSource.element);
                }
            }
            childs.forEach(it => {
                const eventName = it.getAttribute('dr-form:event') ?? 'change'
                const validatorName = it.getAttribute('dr-form:validator');
                const attrEventName = EventManager.attrPrefix + 'event-' + eventName;
                let varpath = ScriptUtils.evalReturn(this.elementSource.element.getAttribute('dr-form:name') ?? '', this.source.obj) ?? it.getAttribute('name');
                if (varpath != null) {
                    if (validatorName) {
                        ScriptUtils.eval(`
                                    ${this.render.bindScript}
                                    const validator = typeof ${validatorName} ==='function' ?  new  ${validatorName}() : ${validatorName};
                                    ${this.elementSource.attrs.drForm}['${varpath}'] = validator;
                                `,
                        Object.assign(this.source.obj, {
                            __render: Object.freeze({
                                drStripOption: this.elementSource.attrs.drStripOption,
                                ...this.render
                            } as Render)
                        }
                        ));
                    }
                    varpath = `${this.elementSource.attrs.drForm}['${varpath}']`;
                    const data = ScriptUtils.evalReturn(`${varpath}`, this.source.obj);
                    if (data instanceof ValidatorArray) {
                        it.setAttribute(attrEventName, `${varpath}.setArrayValue($target, $target.value, $event); ${it.getAttribute(attrEventName) ?? ''};`);
                        data.addValidator((it as any).value, it);
                    } else if (data instanceof Validator) {
                        // varpath += (varpath ? '.value' : 'value');
                        // varpath = drAttr.drForm + '.' + varpath;
                        // it.setAttribute(attrEventName, `${varpath} = $target.value; ${target}=$target; ${event}=$event;`);
                        it.setAttribute(attrEventName, `${varpath}.set($target.value, $target, $event); ${it.getAttribute(attrEventName) ?? ''};`);
                        data.setTarget(it);
                        data.value = (it as any).value;
                    } else {
                        it.setAttribute(attrEventName, `${varpath} = $target.value;`);
                    }
                }
            })
            RawSet.drFormOtherMoveAttr(this.elementSource.element, 'temp-name', 'name', this.source.config);
            this.returnContainer.raws.push(...RawSet.checkPointCreates(this.elementSource.element, this.source.obj, this.source.config));
            return ExecuteState.EXECUTE;
        }
        return ExecuteState.NO_EXECUTE;
    }
}