import { Directive, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Directive({
    selector: '[appUSDInput]',
    providers: [DecimalPipe]
})
export class USDInputDirective implements OnDestroy, OnInit {
    private subscription: Subscription;
    constructor(private ngControl: NgControl, private decimal: DecimalPipe) {

    }
    ngOnInit(): void {
        const control = this.ngControl.control;
        this.subscription = control.valueChanges.pipe(
            map(value => {
                return this.formatToCurrency(value);
            })
        ).subscribe(v => control.setValue(v, { emitEvent: false }));
        if (control.value === '') {
            return;
        }
        control.setValue(this.formatToCurrency(control.value), { emitEvent: false });
    }

    formatToCurrency(value: any): string {
        if (value === '') {
            return '';
        }
        if (value.toString().trimEnd() === '$') {
            return '';
        }
        const parts = value.toString().replace('$', '').replace(/,/g, '').split('.');
        if (isNaN(+parts[0])) { return ''; }
        parts[0] = this.decimal.transform(parts[0]);
        return `${parts.join('.')}`;
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
