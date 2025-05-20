import { Parser } from '../parser';

describe('Parser', () => {

    test('is a class', () => {
        expect(typeof Parser).toBe('function');
    });

    test('can parse a simple grammar', () => {
        const parser = new Parser;
        const source = 'zero = "0";';
        const parsed = parser.parse(source);

        expect(parsed).toStrictEqual({
            type: 'Grammar',
            rules: [
                {
                    type: 'Rule',
                    identifier: {
                        type: 'Identifier',
                        value: 'zero',
                    },
                    rhs: {
                        type: 'Terminal',
                        value: '0',
                    },
                },
            ],
        });
    });

    test('throws an error when trying to eat a token on the end of the source', () => {
        const parser = new Parser;
        const source = 'zero = "0";';
        parser.parse(source);

        expect(() => { parser.eat('identifier'); }).toThrow(SyntaxError);
    });

    test('throws an error when trying to eat a token different than the lookahead', () => {
        const parser = new Parser;
        const source = 'zero = "0";';
        parser.parse(source);
        parser.reset();

        expect(() => { parser.eat('terminal'); }).toThrow(SyntaxError);
    });

    test('can parse multiple rules', () => {
        const parser = new Parser;
        const source = `
        zero = "0";
        one = "1";
        `;
        const parsed = parser.parse(source);

        expect(parsed.rules).toHaveLength(2);
    });

    test('can parse rhs identifiers', () => {
        const parser = new Parser;
        const source = `
        zero = "0";
        one minus one = zero;
        `;
        const parsed = parser.parse(source);

        expect(parsed.rules).toHaveLength(2);
    });

});