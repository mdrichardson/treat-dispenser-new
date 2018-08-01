import { trigger, query, animate, transition, style, stagger } from '@angular/animations';

// Fade each item in from either top or bottom with a slight delay between items
// Use @staggerItems on parent element and stagger-from-top/bottom with each item's class
export const staggerItems =
    trigger('staggerItems', [
        transition('* => *', [
            query('.stagger-from-top', style({ opacity: 0, transform: 'translateY(-40px)' }), {optional: true}),
            query('.stagger-from-bottom', style({ opacity: 0, transform: 'translateY(40px)' }), {optional: true}),
            query('.stagger-from-top, .stagger-from-bottom', stagger('50ms', [
                animate('400ms 400ms ease', style({ opacity: 1, transform: 'translateY(0)' })),
            ])),
            query('.stagger-from-top, .stagger-from-bottom', [
                animate(400, style('*'))
            ])
        ])
    ])