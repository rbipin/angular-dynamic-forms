export interface IChangeEvent {
    controlName: string;
    recentValue: string;
    values: string[];
    controlType: ControlType;
    action: ControlActionType;
    specialCommand: string;
}

export enum ControlType {
    CheckBox = 'checkbox',
    Chip = 'chip'
}

export enum ControlActionType {
    Checked = 'checked',
    UnChecked = 'unchecked',
    Change = 'change'
}
