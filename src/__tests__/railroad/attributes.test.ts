import { Attribute, Attributes } from '../../railroad/attributes';

describe('Railroad / Attribute', () => {

    test('accepts valid attribute names', () => {
        expect(Attribute.isValidName('name')).toBeTruthy();
        expect(Attribute.isValidName('data-state')).toBeTruthy();
    });

    test('rejects invalid attribute names', () => {
        expect(Attribute.isValidName('not "valid"')).toBeFalsy();
        expect(Attribute.isValidName('also invalid!')).toBeFalsy();
    });

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

describe('Railroad / Attributes', () => {

    test('accepts valid attribute names', () => {
        const attributes = new Attributes();
        attributes.add('id', 'diagram');
        expect(attributes.get('id')).toBe('diagram');
    });

    test('prevails the last value in case of multiple calls', () => {
        const attributes = new Attributes();
        attributes.add('id', 'forget');
        attributes.add('id', 'diagram');
        expect(attributes.get('id')).toBe('diagram');
    });

    test('returns undefiend for non defined attribute names', () => {
        const attributes = new Attributes();
        attributes.add('id', 'diagram');
        expect(attributes.get('class')).toBeUndefined();
    });

    test('concatenates attribute values', () => {
        const attributes = new Attributes();
        attributes.add('d', 'M5 5');
        attributes.concat('d', ' m10 10')
        expect(attributes.get('d')).toBe('M5 5 m10 10');
    });

    test('concatenate works even if add wasn\'t called first', () => {
        const attributes = new Attributes();
        attributes.concat('d', 'M10 10')
        expect(attributes.get('d')).toBe('M10 10');
    });

    test('converts the attributes to a string', () => {
        const attributes = new Attributes();
        attributes.add('id', 'diagram');
        attributes.add('title', 'Diagram');
        expect(attributes.toString()).toBe('id="diagram" title="Diagram"');
    });

    test('converts the attributes to a dictionary', () => {
        const attributes = new Attributes();
        attributes.add('id', 'diagram');
        attributes.add('title', 'Diagram');
        expect(attributes.toDictionary()).toStrictEqual({id: 'diagram', title: 'Diagram'});
    });

});