import { FormGroup } from '@angular/forms';
import { INode } from './node';

export class ControlMap {
    subFormGroup: FormGroup = null;
    multipleInputLabel: string;
    private nodeList: Map<string, INode> = new Map();
    private parentNodeList: Map<string, INode> = new Map();
    readonly mapUId: string;
    private onAdd: any = () => { };
    private onRemove: any = () => { };

    get hasNodes() {
        if (this.nodeList.size === 0) {
            return false;
        }
        return true;
    }

    get nodeCount() {
        return this.nodeList.size;
    }

    constructor(uid: string) {
        this.mapUId = uid;
    }

    registerOnAdd(addFn: any) {
        this.onAdd = addFn;
    }

    registerOnRemove(removeFn: any) {
        this.onRemove = removeFn;
    }

    addNode(node: INode): void {
        if (this.nodeList.has(node.key)) {
            return;
        }
        this.nodeList.set(node.key, node);
        this.onAdd(this.subFormGroup, node, this.mapUId);
    }

    addToNode(sourceNode: INode, relationship: string, destinationNode: INode) {
        if (destinationNode === null) {
            return;
        }
        if (!this.nodeList.has(sourceNode.key)) {
            this.nodeList.set(sourceNode.key, sourceNode);
        }
        this.nodeList.set(destinationNode.key, destinationNode);
        this.parentNodeList.set(destinationNode.key, sourceNode);
        sourceNode.addChild(destinationNode, relationship);
        destinationNode.parent = sourceNode;
        this.onAdd(this.subFormGroup, destinationNode, this.mapUId);
    }

    get(key: string): INode {
        if (!this.nodeList.has(key)) {
            return null;
        }
        return this.nodeList.get(key);
    }

    remove(node: INode) {
        const key = node.key;
        this.nodeList.delete(key);
        this.onRemove(this.subFormGroup, node, this.mapUId);
        if (!this.parentNodeList.has(key)) {
            return;
        }
        const parentNode = this.parentNodeList.get(key);
        parentNode.removeChild(node);
        this.parentNodeList.delete(key);
        if (node.hasChildren) {
            node.children.forEach((child) =>
                this.remove(child)
            );
        }
    }

    getAll(): INode[] {
        const allNodes: INode[] = [];
        if (this.nodeList == null || this.nodeList.size === 0) {
            return null;
        }
        this.nodeList.forEach((item) => allNodes.push(item));
        return allNodes;
    }
}
