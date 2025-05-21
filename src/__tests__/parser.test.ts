import { ChoiceNode, OptionalNode, RepetitionNode, SequenceNode, SpecialNode } from '../factory';
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
        parser.read(source);
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

    test('throws an error when trying to read a right hand side where there isn\'t one', () => {
        const parser = new Parser;
        const source = 'zero = "0";';
        parser.read(source);
        parser.reset();
        parser.eat('identifier');

        expect(() => { parser.Rhs(); }).toThrow(SyntaxError);
    });

    test('can parse choices', () => {
        const parser = new Parser;
        const source = 'binary = "0" | "1";';
        const parsed = parser.parse(source);

        expect(parsed.rules).toHaveLength(1);

        const rule = parsed.rules[0];
        expect(rule.identifier.value).toBe('binary');
        expect(rule.rhs.type).toBe('Choice');

        const choice = (rule.rhs as ChoiceNode);
        expect(choice.left).toStrictEqual({ type: 'Terminal', value: '0' });
        expect(choice.right).toStrictEqual({ type: 'Terminal', value: '1' });
    });

    test('can parse sequences', () => {
        const parser = new Parser;
        const source = 'group = "(" , rhs , ")";';
        const parsed = parser.parse(source);

        expect(parsed.rules).toHaveLength(1);

        const rule = parsed.rules[0];
        expect(rule.identifier.value).toBe('group');
        expect(rule.rhs.type).toBe('Sequence');

        expect(rule.rhs).toStrictEqual({
            type: 'Sequence',
            left: {
                type: 'Sequence',
                left: { type: 'Terminal', value: '(' },
                right: { type: 'Identifier', value: 'rhs' }
            },
            right: { type: 'Terminal', value: ')' }
        });
    });

    test('can parse groups', () => {
        const parser = new Parser;
        const source = 'two binary digits = ("0" | "1"), ("0" | "1");';
        const parsed = parser.parse(source);

        expect(parsed.rules).toHaveLength(1);

        const rule = parsed.rules[0];
        expect(rule.identifier.value).toBe('two binary digits');

        const sequence = (rule.rhs as SequenceNode);
        expect(sequence.left.type).toBe('Group');
        expect(sequence.right.type).toBe('Group');
    });

    test('can parse repetitions', () => {
        const parser = new Parser;
        const source = 'binary sequence = {"0" | "1"};';
        const parsed = parser.parse(source);

        expect(parsed.rules).toHaveLength(1);

        const rule = parsed.rules[0];
        expect(rule.identifier.value).toBe('binary sequence');

        const repetition = (rule.rhs as RepetitionNode);
        expect(repetition.value.type).toBe('Choice');
    });

    test('can parse optionals', () => {
        const parser = new Parser;
        const source = 'signed number = [minus], number;';
        const parsed = parser.parse(source);

        expect(parsed.rules).toHaveLength(1);

        const rule = parsed.rules[0];
        expect(rule.identifier.value).toBe('signed number');

        const sequence = (rule.rhs as SequenceNode);
        const optional = (sequence.left as OptionalNode);
        expect(optional.value).toStrictEqual({ type: 'Identifier', value: 'minus' });
    });

    test('can parse specials', () => {
        const parser = new Parser;
        const source = 'identifier with spaces = ? "[a-zA-Z]+([a-zA-Z0-9 ]+[a-zA-Z0-9])?" ?;';
        const parsed = parser.parse(source);

        expect(parsed.rules).toHaveLength(1);

        const rule = parsed.rules[0];
        expect(rule.identifier.value).toBe('identifier with spaces');

        const special = (rule.rhs as SpecialNode);
        expect(special.value).toStrictEqual({ type: "Terminal", value: "[a-zA-Z]+([a-zA-Z0-9 ]+[a-zA-Z0-9])?" });
    });

});