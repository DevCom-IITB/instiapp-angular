import {trigger, animate, style, group, animateChild, query, stagger, transition} from '@angular/animations';

export const EnterLeft = trigger(
  'enterLeft', [
    transition('void => true', [
      style({transform: 'translateX(-10%)', opacity: 0}),
      animate('250ms ease-in-out', style({transform: 'translateX(0)', opacity: 1}))
    ])
  ]
);

export const EnterRight = trigger(
  'enterRight', [
    transition('* => true', [
      style({transform: 'translateX(10%)', opacity: 0}),
      animate('250ms ease-in-out', style({transform: 'translateX(0)', opacity: 1}))
    ]),
    transition('true => false', [
      animate('250ms ease-in-out', style({transform: 'translateX(10%)', opacity: 0})),
    ])
  ]
);
