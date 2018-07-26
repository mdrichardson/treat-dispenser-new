import { trigger, query, animate, transition, style, stagger } from '@angular/animations';

export const staggerItems =
    trigger('staggerItems', [
        transition('* => *', [
            query('.stagger-from-top', style({ opacity: 0, transform: 'translateY(-40px)' }), {optional: true}),
            query('.stagger-from-bottom', style({ opacity: 0, transform: 'translateY(40px)' }), {optional: true}),
            query('.stagger-from-top, .stagger-from-bottom', stagger('50ms', [
                animate('800ms 800ms ease', style({ opacity: 1, transform: 'translateY(0)' })),
            ])),
            query('.stagger-from-top, .stagger-from-bottom', [
                animate(800, style('*'))
            ])
        ])
    ])