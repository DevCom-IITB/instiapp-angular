import {trigger, animate, style, transition} from '@angular/animations';

export const EnterFade = trigger(
  'enterFade', [
    transition('* => true', [
      style({opacity: 0}),
      animate('250ms ease-in-out', style({opacity: 1}))
    ]),
    transition('true => false', [
      animate('250ms ease-in-out', style({opacity: 0})),
    ])
  ]
);
