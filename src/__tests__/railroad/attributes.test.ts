import { Attribute, Attributes } from '../../railroad/attributes';

describe('Railroad / Attribute', () => {

    describe('Constructor', () => {

        it('rejects invalid attribute names', () => {
            const name = 'not "valid"';

            expect(() => new Attribute(name, '')).toThrow(SyntaxError);
        });

    });

    describe('Static method: isValidName', () => {

        it('accepts valid attribute names', () => {
            expect(Attribute.isValidName('name')).toBeTruthy();
            expect(Attribute.isValidName('data-state')).toBeTruthy();
        });

        it('rejects invalid attribute names', () => {
            expect(Attribute.isValidName('not "valid"')).toBeFalsy();
            expect(Attribute.isValidName('also invalid!')).toBeFalsy();
        });

    });

    describe('Getter: name', () => {

        it('accepts valid attribute names', () => {
            const name = 'data-state';
            const state = new Attribute(name, '');

            expect(state.name).toBe(name);
        });

    });

    describe('Getter: value', () => {

        it('returns the stored value', () => {
            const name = 'data-state';
            const value = 'closed';
            const state = new Attribute(name, value);

            expect(state.value).toBe(value);
        });

    });

    describe('Getter: escaped', () => {

        it('returns the escaped value', () => {
            const name = 'data-query';
            const value = 'width="10"&height="10"';
            const state = new Attribute(name, value);

            expect(state.escaped).toBe('width=&quot;10&quot;&amp;height=&quot;10&quot;');
        });

    });

    describe('Method: toString', () => {

        it('returns the attribute\'s name and value as a string', () => {
            const name = 'id';
            const value = 'diagram';
            const id = new Attribute(name, value);

            expect(id.toString()).toBe('id="diagram"');
        });

    });

});

describe('Railroad / Attributes', () => {

    describe('Constructor', () => {

        it('accept values on construction', () => {
            const attributes = new Attributes({
                id: 'diagram',
                class: 'railroad',
            });

            expect(attributes.get('id')).toBe('diagram');
            expect(attributes.get('class')).toBe('railroad');
        });
    });

    describe('Method: add', () => {

        it('accepts valid attribute names', () => {
            const attributes = new Attributes();
            attributes.add('id', 'diagram');

            expect(attributes.get('id')).toBe('diagram');
        });

        it('prevails the last value in case of multiple calls', () => {
            const attributes = new Attributes();
            attributes.add('id', 'forget');
            attributes.add('id', 'diagram');

            expect(attributes.get('id')).toBe('diagram');
        });

    });

    describe('Method: get', () => {

        it('returns undefined for non defined attribute names', () => {
            const attributes = new Attributes();
            attributes.add('id', 'diagram');

            expect(attributes.get('class')).toBeUndefined();
        });

    });

    describe('Method: concat', () => {

        it('concatenates attribute values', () => {
            const attributes = new Attributes();
            attributes.add('d', 'M5 5');
            attributes.concat('d', ' m10 10');

            expect(attributes.get('d')).toBe('M5 5 m10 10');
        });

        it('concatenate works even if add wasn\'t called first', () => {
            const attributes = new Attributes();
            attributes.concat('d', 'M10 10')

            expect(attributes.get('d')).toBe('M10 10');
        });

    });

    describe('Method: toString', () => {

        it('converts the attributes to a string', () => {
            const attributes = new Attributes();
            attributes.add('id', 'diagram');
            attributes.add('title', 'Diagram');

            expect(attributes.toString()).toBe('id="diagram" title="Diagram"');
        });

    });

    describe('Method: toDictionary', () => {

        it('converts the attributes to a dictionary', () => {
            const attributes = new Attributes();
            attributes.add('id', 'diagram');
            attributes.add('title', 'Diagram');

            expect(attributes.toDictionary()).toStrictEqual({id: 'diagram', title: 'Diagram'});
        });

    });

});