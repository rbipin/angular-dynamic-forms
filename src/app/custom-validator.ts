import { AbstractControl } from '@angular/forms';

export class CustomValidator {
    static invalidEntry(control: AbstractControl) {
        const val = control.value;
        if (CustomValidator.hasEmtpySpace(val)) {
            return { invalidEntry: true };
        }
        return null;
    }

    private static hasEmtpySpace(value: string): boolean {
        if (value.trim() === '') {
            return true;
        }
        return false;
    }

    // Number only validation
    static numeric(control: AbstractControl) {
        const val = control.value;
        if (val === null || val === '') { return null; }
        if (!val.toString().match(/^[0-9]+(\.?[0-9]+)?$/)) { return { invalidNumber: true }; }
        return null;
    }

    static usdCurrency(control: AbstractControl) {
        let val = control.value;
        if (val === null || val === '') { return null; }
        if (val[0] === '$') {
            val = val.toString().replace('$ ', '');
        }
        if (!val.toString().match(/(?=.*\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|0)?(\.\d{1,2})?$/)) { return { invalidNumber: true }; }
        return null;
    }
}
