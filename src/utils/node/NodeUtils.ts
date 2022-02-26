export type Attr = {name: string, value: any}
export class NodeUtils {
    // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    static removeAllChildNode(node: Node) {
        while (node?.firstChild) {
            node.firstChild.remove();
        }
    }

    static appendChild(parentNode: Node, childNode: Node) {
        return parentNode.appendChild(childNode)
    }

    static replaceNode(targetNode: Node, newNode: Node) {
        // console.log('repalceNode', targetNode, newNode, targetNode.parentNode)
        return targetNode.parentNode?.replaceChild(newNode, targetNode);
    }

    static addNode(targetNode: Node, newNode: Node) {
        return targetNode.parentNode?.insertBefore(newNode, targetNode.nextSibling);
    }
}
