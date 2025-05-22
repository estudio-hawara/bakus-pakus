import { escape } from '../../railroad/utils';

describe('Railroad / utils / escape', () => {

    test('leaves strings without special characters untouched', () => {
        const original = 'hello world';
        const escaped = escape(original);
        expect(escaped).toBe(original);
    });

    test('replaces special characters', () => {
        const original = '<hello *world*>';
        const escaped = escape(original);
        expect(escaped).toBe('&#60;hello &#42;world&#42;&#62;');
    });

});