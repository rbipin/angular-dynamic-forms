import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-star-rating',
    templateUrl: './star-rating.component.html',
    styleUrls: ['./star-rating.component.scss']
})

export class StarRatingComponent implements OnInit {

    @Input('rating') private currentRating: number = -1;
    @Input('max') private maxRating: number = 5;
    @Input('color') private color: string = 'yellow';
    @Output() private ratingChanged = new EventEmitter();
    ngOnInit(): void {
        this.currentRating = this.currentRating <= 0 ? -1 : this.currentRating;
    }

    numberOfRating(): Array<number> {
        return Array(this.maxRating);
    }

    showIcon(starIndex: number) {
        if (starIndex > this.currentRating - 1) {
            return 'star_border'
        }
        return 'star'
    }

    onClick(starIndex: number) {
        this.currentRating = starIndex;
        this.ratingChanged.emit(starIndex);
    }

}