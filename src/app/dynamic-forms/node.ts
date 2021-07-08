import { FormGroup } from '@angular/forms';
import { IQuestion } from '../models/questions';

export interface INode {
    key: string;
    readonly hasChildren: boolean;
    questions: IQuestion[];
    isGroup: boolean;
    readonly uid: string;
    formControls: FormGroup;
    readonly label: string;
    showNextButton: boolean;
    parent: INode;
    children: Map<string, INode>;
    relationship: Map<string, INode[]>;
    readonly childrenCount: number;
    addChild(childNode: INode, relationship: string): void;
    getChild(key: string): INode;
    getChildForRelation(relationship: string): INode[];
    getChildren(): INode[];
    hasRelation(relationship: string): boolean;
    removeChild(node: INode): void;
}
