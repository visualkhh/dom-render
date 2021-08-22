import {RandomUtils} from './utils/random/RandomUtils';
import {StringUtils} from './utils/string/StringUtils';
import {ScriptUtils} from './utils/script/ScriptUtils';

export class RawSet {
    public static readonly DR_IF_NAME = 'dr-if';
    public static readonly DR_FOR_OF_NAME = 'dr-for-of';
    public static readonly DR_INCLUDE_NAME = 'dr-include';
    public static readonly DR_REPLACE_NAME = 'dr-replace';
    public static readonly DR_FOR_NAME = 'dr-for';
    public static readonly DR_DETECT_NAME = 'dr-detect';
    public static readonly DR_STATEMENT_NAME = 'dr-statement';

    public static readonly DR_SCRIPT_ELEMENTNAME = 'dr-script';
    public static readonly DR_ELEMENTS = [RawSet.DR_SCRIPT_ELEMENTNAME];

    public static readonly DR_PARAMETER_OPTIONNAME = 'dr-parameter';
    public static readonly DR_IT_OPTIONNAME = 'dr-it';
    public static readonly DR_PIPE_OPTIONNAME = 'dr-pipe';
    public static readonly DR_STRIP_OPTIONNAME = 'dr-strip';
    public static readonly DR_THIS_OPTIONNAME = 'dr-this';
    public static readonly DR_CONTENT_OPTIONNAME = 'dr-content';
    public static readonly DR_ATTRIBUTES = [RawSet.DR_IF_NAME, RawSet.DR_FOR_OF_NAME, RawSet.DR_INCLUDE_NAME, RawSet.DR_REPLACE_NAME, RawSet.DR_FOR_NAME, RawSet.DR_DETECT_NAME, RawSet.DR_STATEMENT_NAME];

    constructor(public point: { start: Comment, end: Comment }, public fragment: DocumentFragment) {
    }

    get isConnected() {
        return this.point.start.isConnected && this.point.end.isConnected;
    }

    get usingTriggerVariables(): Set<string> {
        const usingTriggerVariables = new Set<string>();
        this.fragment.childNodes.forEach((cNode, key) => {
            if (cNode.nodeType === Node.TEXT_NODE) {
                ScriptUtils.getVariablePaths(`\`${(cNode as Text).textContent ?? ''}\``).forEach(it => usingTriggerVariables.add(it));
            } else if (cNode.nodeType === Node.ELEMENT_NODE) {
                const element = cNode as Element;
                ScriptUtils.getVariablePaths(RawSet.DR_ATTRIBUTES.map(it => (element.getAttribute(it) ?? '')).join(';')).forEach(it => usingTriggerVariables.add(it));
            }
        })
        // console.log('----->', usingVars);

        return usingTriggerVariables;
    }

    public render(obj: any) {
        const genNode = document.importNode(this.fragment, true);
        const raws: RawSet[] = [];
        genNode.childNodes.forEach((cNode, key) => {
            const fag = document.createDocumentFragment()
            if (cNode.nodeType === Node.TEXT_NODE) {
                const textContent = cNode.textContent;
                const n = document.createTextNode(ScriptUtils.eval(`return \`${textContent}\``, obj))
                cNode.parentNode?.replaceChild(n, cNode)
            } else if (cNode.nodeType === Node.ELEMENT_NODE) {
                const element = cNode as Element;
                const drIf = element.getAttribute(RawSet.DR_IF_NAME);
                const drFor = element.getAttribute(RawSet.DR_FOR_NAME);
                element.removeAttribute(RawSet.DR_IF_NAME);
                element.removeAttribute(RawSet.DR_FOR_NAME);
                if (drIf) {
                    const r = ScriptUtils.eval(`return ${drIf}`, obj);
                    if (r) {
                        Array.from(element.childNodes).forEach(it => fag.append(it));
                        const rr = RawSet.checkPointCreates(fag)
                        element.appendChild(fag);
                        raws.push(...rr)
                    } else {
                        cNode.remove();
                    }
                }
                if (drFor) {
                    // const copyElement = element.cloneNode(true)
                    ScriptUtils.eval(`for(${drFor}) { this.__fag.append(this.__element.cloneNode(true)) }`, Object.assign({__fag: fag, __element: element}, obj));
                    const rr = RawSet.checkPointCreates(fag)
                    console.log('-----rr', rr)
                    element.parentNode?.replaceChild(fag, element);
                    raws.push(...rr)
                }
            }
        })
        this.replaceBody(genNode);
        return raws;

        // return this.make(obj);
    }

    public replaceBody(genNode: Node) {
        this.childAllRemove();
        this.point.start.parentNode?.insertBefore(genNode, this.point.start.nextSibling);
    }

    public static checkPointCreates(element: Node): RawSet[] {
        const nodeIterator = document.createNodeIterator(element, NodeFilter.SHOW_ALL, {
            acceptNode(node) {
                // console.log('node type-->', node.nodeType)
                if (node.nodeType === Node.TEXT_NODE) {
                    return /\$\{.*?\}/g.test(StringUtils.deleteEnter((node as Text).data ?? '')) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    return (node as Element).getAttributeNames().filter(it => RawSet.DR_ATTRIBUTES.includes(it.toLowerCase())).length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_REJECT;
            }
        });
        const pars: RawSet[] = [];
        let currentNode;
        // eslint-disable-next-line no-cond-assign
        while (currentNode = nodeIterator.nextNode()) {
            console.log('checkPointCreates', element, currentNode)
            // if (currentNode.nodeType === Node.TEXT_NODE && currentNode.textContent) {
            //     currentNode.textContent = currentNode.textContent?.replace(/\$\{.*?\}/g, '<b>$1</b>');
            // }
            const uuid = RandomUtils.uuid()
            const fragment = document.createDocumentFragment();
            const start = document.createComment(`start ${uuid}`)
            const end = document.createComment(`end ${uuid}`)
            // const content = document.createComment('');
            // if (currentNode.nodeType === Node.ELEMENT_NODE) {
            //     content.data = (currentNode as Element).outerHTML;
            // } else if (currentNode.nodeType === Node.TEXT_NODE) {
            //     content.data = currentNode.textContent ?? '';
            // }
            currentNode?.parentNode?.insertBefore(start, currentNode);
            // currentNode?.parentNode?.insertBefore(content, currentNode);
            currentNode?.parentNode?.insertBefore(end, currentNode.nextSibling);
            fragment.append(currentNode);
            pars.push(new RawSet({
                start,
                end
            }, fragment))
        }
        return pars;
    }

    public childAllRemove() {
        let next = this.point.start.nextSibling;
        while (next) {
            if (next === this.point.end) {
                break;
            }
            next.remove();
            next = this.point.start.nextSibling;
        }
    }

    // public static targetPintCheckNodes(target: Node): {start: Comment, end: Comment, target: Node}[] {
    //     return this.targetNodes(target).map(target => {
    //         const uuid = RandomUtils.uuid()
    //         const start = document.createComment(`start ${uuid}`)
    //         const end = document.createComment(`end ${uuid}`)
    //         target?.parentNode?.insertBefore(start, target);
    //         target?.parentNode?.insertBefore(end, target.nextSibling);
    //         return {start, end, target}
    //     })
    // }

    public static targetNodes(target: Node) {
        const nodeIterator = this.targetNodeIterator(target);
        const pars: Node[] = [];
        let currentNode;
        // eslint-disable-next-line no-cond-assign
        while (currentNode = nodeIterator.nextNode()) {
            pars.push(currentNode);
        }
        return pars;
    }

    public static targetNodeIterator(target: Node) {
        const nodeIterator = document.createNodeIterator(target, NodeFilter.SHOW_ALL, {
            acceptNode(node) {
                // console.log('node type-->', node.nodeType)
                if (node.nodeType === Node.TEXT_NODE) {
                    return /\$\{.*?\}/g.test(StringUtils.deleteEnter((node as Text).data ?? '')) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    return (node as Element).getAttributeNames().filter(it => RawSet.DR_ATTRIBUTES.includes(it.toLowerCase())).length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_REJECT;
            }
        });
        return nodeIterator;
    }

    // public static checkPointCreate(node: Node): RawSet {
    //     const uuid = RandomUtils.uuid()
    //     const start = document.createComment(`start ${uuid}`)
    //     const end = document.createComment(`end ${uuid}`)
    //     node?.parentNode?.insertBefore(start, node);
    //     node?.parentNode?.insertBefore(end, node.nextSibling);
    //     const fragment = document.createDocumentFragment();
    //     fragment.append(node);
    //     return new RawSet({
    //         start,
    //         end
    //     }, fragment)
    // }
}