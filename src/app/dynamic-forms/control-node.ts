import { FormGroup } from '@angular/forms';
import { IQuestion } from '../models/questions';
import { INode } from './node';

export class ControlNode implements INode {
    key: string;
    get hasChildren() {
        if (this.children == null || this.children.size === 0) {
            return false;
        }
        return true;
    }
    private uniqueId: string;
    get uid() {
        return this.uniqueId;
    }
    questions: IQuestion[];
    get isGroup() {
        if (this.formControls == null) {
            return false;
        }
        const controls = Object.keys(this.formControls.controls);
        if (controls == null || controls.length <= 0) {
            return false;
        }
        if (controls.length === 1) {
            return false;
        }
        return true;
    }

    get childrenCount(): number {
        if (this.children == null) {
            return 0;
        }
        return this.children.size;
    }
    formControls: FormGroup;
    label: string;
    showNextButton: boolean;
    parent: INode;
    children: Map<string, INode> = new Map();
    relationship: Map<string, INode[]> = new Map();
    constructor(key: string, formGroup: FormGroup, formLabel: string, parentNode: INode = null) {
        this.key = key;
        this.formControls = formGroup;
        this.label = formLabel;
        this.uniqueId = Date.now().toString();
        this.parent = parentNode;
    }
    getChildren(): INode[] {
        const allChildren: INode[] = [];
        this.children.forEach((value: INode, key: string) => {
            allChildren.push(value);
        });
        return allChildren;
    }
    hasRelation(relationship: string): boolean {
        if (this.relationship.size === 0) {
            return false;
        }
        return this.relationship.has(relationship);
    }
    addChild(childNode: INode, relationship: string) {
        if (this.children == null || this.children.size === 0) {
            this.children = new Map();
        }
        this.children.set(childNode.key, childNode);
        if (!this.relationship.has(relationship)) {
            this.relationship.set(relationship, [childNode]);
            return;
        }
        this.relationship.get(relationship).push(childNode);
    }
    getChild(key: string): INode {
        if (this.children == null || this.children.size === 0) {
            return null;
        }
        return this.children.get(key);
    }
    getChildForRelation(relationship: string): INode[] {
        if (this.relationship.size === 0) {
            return null;
        }
        return this.relationship.get(relationship);
    }
    removeChild(node: INode) {
        if (this.children.has(node.key)) {
            this.relationship.forEach((value: INode[], key: string) => {
                const childNode = value.find(child => child.key === node.key);
                if (childNode != null) {
                    this.relationship.delete(key);
                    return;
                }
            });
            this.children.delete(node.key);
        }
    }

}
