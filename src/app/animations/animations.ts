import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const highlightedStateTrigger = trigger('highlightedState', [
  state('default', style({ border: '2px solid #b2b6ff' })),
  state(
    'highlighted',
    style({ border: '4px solid #b2b6ff', filter: 'brightness' })
  ),
  transition('default => highlighted', [
    animate('200ms ease-out', style({ transorm: 'scale(1.02)' })),
    animate(200),
  ]),
]);

export const shownStateTrigger = trigger('shownState', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate(300, style({ opacity: 1 })),
  ]),
  transition(':leave', [animate(300, style({ opacity: 0 }))]),
]);
