import { isValidAttributeName, Attribute, Attributes } from '../../renders/attributes';

describe('Renders/isValidAttributeName', () => {

    test('accepts valid attribute names', () => {
        expect(isValidAttributeName('name')).toBeTruthy();
        expect(isValidAttributeName('data-state')).toBeTruthy();
    });

    test('rejects invalid attribute names', () => {
        expect(isValidAttributeName('not "valid"')).toBeFalsy();
        expect(isValidAttributeName('also invalid!')).toBeFalsy();
    });

});

describe('Renders/Attribute', () => {

    test('accepts valid attribute names', () => {
        const name = 'data-state';
        const state = new Attribute(name, '');
        expect(state.name).toBe(name);
    });

    test('rejects invalid attribute names', () => {
        const name = 'not "valid"';
        expect(() => new Attribute(name, '')).toThrow(SyntaxError);
    });

    test('returns the stored value', () => {
        const name = 'data-state';
        const value = 'closed';
        const state = new Attribute(name, value);
        expect(state.value).toBe(value);
    });

    test('returns the escaped value', () => {
        const name = 'data-query';
        const value = 'width="10"&height="10"';
        const state = new Attribute(name, value);
        expect(state.escaped).toBe('width=&quot;10&quot;&amp;height=&quot;10&quot;');
    });

    test('returns the attribute\'s name and value as a string', () => {
        const name = 'id';
        const value = 'diagram';
        const id = new Attribute(name, value);
        expect(id.toString()).toBe('id="diagram"');
    });

});

describe('Renders/Attributes', () => {

    test('accepts valid attribute names', () => {
        const attributes = new Attributes();
        attributes.add('id', 'diagram');
        attributes.add('title', 'Diagram');
        expect(attributes.toString()).toBe(' id="diagram" title="Diagram"');
    });

});