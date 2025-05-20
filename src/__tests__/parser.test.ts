import { Parser } from '../parser';

describe('Parser', () => {

    test('is a class', () => {
        expect(typeof Parser).toBe('function');
    });

    test('returns the next token', () => {
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

});