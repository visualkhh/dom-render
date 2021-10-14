// // https://developer.mozilla.org/ko/docs/Web/Web_Components/Using_custom_elements
// import {ScriptUtils} from '../script/ScriptUtils';
// import {ConstructorType} from '../../types/Types';
// import {RandomUtils} from '../random/RandomUtils';
//
// export interface CustomElements {
//     // 커스텀 엘리먼트가 document의 DOM에 연결될 때마다 호출
//     connectedCallback?: () => any;
//     // 문서의 DOM에서 사용자 정의 요소의 연결이 끊길 때 호출됩니다.
//     disconnectedCallback?: () => any;
//     // 사용자 지정 요소를 새 문서로 이동할 때 호출됩니다.
//     adoptedCallback?: () => any;
//
//     /* static get */
//     observedAttributes?: string[];
//
//     // element 인스턴스가 생성되었을때
//     createdCallbck?: () => any;
//     // document에 인스턴스가 삽이 되었을때
//     attachedCallback?: () => any;
//     // document에 인스턴스가 삭제 되었을때
//     detachedCallback?: () => any;
//
//     // attribute 추가되거나 삭제되었거나 갱싱되었을때
//     attributeChangedCallback?: (name: string, oldValue: string, newValue: string) => any;
// }
//
// export interface CustomElementDefinitionOptions<T = ConstructorType<CustomElements>> {
//     name: string;
//     extends?: string;
//     extendsClass?: string;
//     rootStore?: { ___domrender_customElement?: { [name: string]: any } };
//     customElementClass: T;
// }
//
// class WebConponentProxy<T extends object> implements ProxyHandler<T> {
//
//     constructor(public customElement: any) {
//     }
//
//     get(target: T, p: string | symbol, receiver: any): any {
//         console.log('WebConponentProxy get', target, p, receiver)
//         if ((target as any)[p]) {
//             return (target as any)[p];
//         } else {
//             return this.customElement[p];
//         }
//     }
//
//     set(target: T, p: string | symbol, value: any, receiver: T): boolean {
//         console.log('WebConponentProxy set--->', target, p, value, receiver);
//         (this.customElement as any)[p] = value;
//         return true;
//     }
// }
//
// export class WebComponentUtils {
//     // public static createCustomElements<T = CustomElements>(option: Omit<CustomElementDefinitionOptions, 'name'>): ConstructorType<T> {
//     public static createCustomElements<C = CustomElements, T = ConstructorType<C>>(option: CustomElementDefinitionOptions): T {
//         let klassName = option.name.replaceAll('-', '');
//         klassName = klassName.charAt(0).toUpperCase() + klassName.slice(1)
//         return ScriptUtils.eval(`
//         const customElementClass = this.option.customElementClass;
//         const rootStore = this.option.rootStore;
//         const randomUtils = this.randomUtils;
//         const WebConponentProxy = this.WebConponentProxy;
//         class ${klassName} extends ${option.extendsClass ?? 'HTMLElement'} {
//             constructor(...arg) {
//                 super();
//                 const customId = "_" + randomUtils.getRandomString(20);
//                 console.log('sssssssssssxx', customId, '-->',rootStore, '<--');
//                 this.setAttribute("dr-custom-elements-id", customId);
//                 this.__domrender_customElement_id = customId;
//                 if (rootStore) {
//                     console.log('rootStore---------', rootStore)
//                     if (!rootStore.__domrender_customElement) {
//                         console.log('ssssssssssssssssssssss');
//                         rootStore.__domrender_customElement = {v:'111'};
//                         console.log('eeeeeeeeeeeeeeeeeeeee');
//                     }
//                     rootStore.__domrender_customElement[customId] = new Proxy(this, new WebConponentProxy(new customElementClass(...arg)));
//                 }
//                 // console.log('createKlassName--0-->', this, this.fullName);
//             }
//         };
//         Object.assign(${klassName}.prototype, customElementClass.prototype);
//         if (customElementClass.prototype.observedAttributes) {
//         ${klassName}.observedAttributes = customElementClass.prototype.observedAttributes;
//         }
//         return ${klassName};
//         `, {
//             option,
//             randomUtils: RandomUtils,
//             WebConponentProxy: WebConponentProxy
//         });
//     }
//
//     public static defineCustomElements<C = CustomElements, T = ConstructorType<C>>(option: CustomElementDefinitionOptions): T {
//         const klass = WebComponentUtils.createCustomElements<C, T>(option);
//         window.customElements.define(option.name, klass as any);
//         return klass;
//     }
// }
