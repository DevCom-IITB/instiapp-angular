import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

@Injectable({
    providedIn: 'root'
})
export class ConfettiService {

    constructor() { }

    public canon(): void {
        confetti({
            spread: this.randomInRange(50, 70),
            particleCount: this.randomInRange(150, 200),
            angle: this.randomInRange(50, 70),
            origin: { x: 0},
          });
          confetti({
            spread: this.randomInRange(50, 60),
            particleCount: this.randomInRange(150, 200),
            angle: this.randomInRange(115, 125),
            origin: { x: 1 },
          });
        confetti({
            spread: this.randomInRange(50, 70),
            particleCount: this.randomInRange(150, 200),
            origin: { y: 1 },
          });
    }

    private randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }
}