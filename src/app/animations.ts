import {trigger, animate, style, group, animateChild, query, stagger, transition} from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
  transition('base => overlay', [
    /* order */
    /* 1 */ query(':enter', style({ position: 'fixed', width: '100%', 'z-index': 2 })
      , { optional: true }),
    /* 2 */ group([  // block executes in parallel
      query(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
      ], { optional: true }),
      query(':leave', [
        animate('0.5s ease-in-out', style({}))
      ], { optional: true }),
    ])
  ]),

  transition('overlay => base', [
    /* order */
            query(':enter', style({ position: 'fixed', width: '100vw', 'z-index': 1 })
      , { optional: true }),
    /* 1 */ query(':leave', style({ position: 'absolute', width: '100%', 'z-index': 2 })
      , { optional: true }),
    /* 2 */ group([  // block executes in parallel
      query(':enter', [
        style({ transform: 'translateX(0%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
      ], { optional: true }),
      query(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
      ], { optional: true }),
    ])
  ])
]);

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
