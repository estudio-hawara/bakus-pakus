import { Choice, Grammar, Group, Identifier, Optional, Repetition, Rhs, Rule, Sequence, Special, Terminal } from '@app/factory';
import { Parser } from '@app/parser';

describe('Parser', () => {

    describe('Constructor', () => {

        it('is a class', () => {
            expect(typeof Parser).toBe('function');
        });

    });

    describe('Method: read', () => {

        it('has a read method', () => {
            const parser = new Parser;
            const source = 'zero = "0";';

            expect(() => parser.read(source)).not.toThrow(Error);
        });

    });

    describe('Method: parse', () => {

        it('can parse a simple grammar', () => {
            const parser = new Parser;
            const source = 'zero = "0";';
            const parsed = parser.parse(source);

            expect(parsed.toDictionary()).toStrictEqual({
                type: 'Grammar',
                rules: [
                    {
                        type: 'Rule',
                        identifier: {
                            type: 'Identifier',
                            value: 'zero',
                        },
                        value: {
                            type: 'Terminal',
                            value: '0',
                        },
                    },
                ],
            });
        });

        it('throws an error when trying to eat a token on the end of the source', () => {
            const parser = new Parser;
            const source = 'zero = "0";';
            parser.parse(source);

            expect(() => { parser.eat('identifier'); }).toThrow(SyntaxError);
        });

        it('can parse multiple rules', () => {
            const parser = new Parser;
            const source = `
            zero = "0";
            one = "1";
            `;
            const parsed = parser.parse(source);

            expect(parsed.rules).toHaveLength(2);
        });

        it('can parse rhs identifiers', () => {
            const parser = new Parser;
            const source = `
            zero = "0";
            one minus one = zero;
            `;
            const parsed = parser.parse(source);

            expect(parsed.rules).toHaveLength(2);
        });

    });

    describe('Method: reset', () => {

        it('throws an error when trying to eat a token different than the lookahead', () => {
            const parser = new Parser;
            const source = 'zero = "0";';
            parser.read(source);
            parser.reset();

            expect(() => { parser.eat('terminal'); }).toThrow(SyntaxError);
        });

    });

    describe('Method: eat', () => {

        it('throws an error when trying to read a right hand side where there isn\'t one', () => {
            const parser = new Parser;
            const source = 'zero = "0";';
            parser.read(source);
            parser.reset();
            parser.eat('identifier');

            expect(() => { parser.Rhs(); }).toThrow(SyntaxError);
        });

    });

    describe('Method: Grammar', () => {

        it('can parse grammars', () => {
            const parser = new Parser;
            const source = 'zero = "0";\none = "1";';

            parser.read(source);
            const grammar = (parser.Grammar() as Grammar);

            expect(grammar.rules).toHaveLength(2);
        });

    });

    describe('Method: RuleList', () => {

        it('can parse lists of rules', () => {
            const parser = new Parser;
            const source = 'zero = "0";\none = "1";';

            parser.read(source);
            const rules = (parser.RuleList() as Array<Rule>);

            expect(rules).toHaveLength(2);
        });

    });

    describe('Method: Rule', () => {

        it('can parse single rules', () => {
            const parser = new Parser;
            const source = 'zero = "0";';

            parser.read(source);
            const rule = parser.Rule();

            expect((rule.identifier as Identifier).value).toBe('zero');
        });

    });

    describe('Method: Identifier', () => {

        it('can parse identifiers', () => {
            const parser = new Parser;
            const source = 'zero = "0";';

            parser.read(source);
            const identifier = parser.Identifier();

            expect(identifier.value).toBe('zero');
        });

    });

    describe('Method: Sequence', () => {

        it('can parse sequences', () => {
            const parser = new Parser;
            const source = 'group = "(" , rhs , ")";';

            parser.read(source);
            parser.Identifier();
            parser.eat('=');

            const sequence = (parser.Sequence() as Sequence);

            expect(sequence.left.toDictionary()).toStrictEqual({
                type: 'Sequence',
                left: { type: 'Terminal', value: '(' },
                right: { type: 'Identifier', value: 'rhs' },
            });
            expect(sequence.right.toDictionary()).toStrictEqual({ type: 'Terminal', value: ')' });
        });

    });

    describe('Method: Choice', () => {

        it('can parse choice', () => {
            const parser = new Parser;
            const source = 'binary = "0" | "1";';

            parser.read(source);
            parser.Identifier();
            parser.eat('=');
            const choice = (parser.Choice() as Choice);

            expect(choice.left.toDictionary()).toStrictEqual({ type: 'Terminal', value: '0' });
            expect(choice.right.toDictionary()).toStrictEqual({ type: 'Terminal', value: '1' });
        });

    });

    describe('Method: Rhs', () => {

        it('can parse groups in right hand sides', () => {
            const parser = new Parser;
            const source = 'sequence or choice = ( rhs , "|" , rhs ) | ( rhs , "," , rhs );';

            parser.read(source);
            parser.Identifier();
            parser.eat('=');
            const group = (parser.Rhs() as Group);

            expect(group.value).toBeInstanceOf(Sequence);
        });

        it('can parse repetitions in right hand sides', () => {
            const parser = new Parser;
            const source = 'grammar = { rule };';

            parser.read(source);
            parser.Identifier();
            parser.eat('=');

            const repetition = (parser.Rhs() as Repetition);
            const identifier = (repetition.value as Identifier);
            expect(identifier.value).toBe('rule');
        });

        it('can parse optionals in right hand sides', () => {
            const parser = new Parser;
            const source = 'phone = [ prefix ], number;';

            parser.read(source);
            parser.Identifier();
            parser.eat('=');

            const optional = (parser.Rhs() as Optional);
            const identifier = (optional.value as Identifier);
            expect(identifier.value).toBe('prefix');
        });

        it('can parse specials in right hand sides', () => {
            const parser = new Parser;
            const source = 'zero = ? one minus one ?;';

            parser.read(source);
            parser.Identifier();
            parser.eat('=');
            const special = (parser.Rhs() as Special);

            expect(special.value).toBe('one minus one');
        });

        it('can parse identifiers in right hand sides', () => {
            const parser = new Parser;
            const source = 'zero = null;';

            parser.read(source);
            parser.Identifier();
            parser.eat('=');
            const identifier = (parser.Rhs() as Identifier);

            expect(identifier.value).toBe('null');
        });

        it('can parse terminals in right hand sides', () => {
            const parser = new Parser;
            const source = 'zero = "0";';

            parser.read(source);
            parser.Identifier();
            parser.eat('=');
            const terminal = (parser.Rhs() as Terminal);

            expect(terminal.value).toBe('0');
        });


    });

    describe('Method: Group', () => {

        it('can parse groups', () => {
            const parser = new Parser;
            const source = 'zero or one = ("0" | "1");';

            parser.read(source);
            parser.Identifier();
            parser.eat('=');
            const group = (parser.Group() as Group);

            expect(group.toDictionary()).toStrictEqual({
                type: "Group",
                value: {
                    type: "Choice",
                    left: {
                        type: "Terminal",
                        value: "0",
                    },
                    right: {
                        type: "Terminal",
                        value: "1",
                    },
                },
            });
        });

    });

    describe('Method: Repetition', () => {

        it('can parse repetitions', () => {
            const parser = new Parser;
            const source = 'binary representation = {"0" | "1"};';

            parser.read(source);
            parser.Identifier();
            parser.eat('=');
            const repetition = (parser.Repetition() as Repetition);

            expect(repetition.toDictionary()).toStrictEqual({
                type: "Repetition",
                value: {
                    type: "Choice",
                    left: {
                        type: "Terminal",
                        value: "0",
                    },
                    right: {
                        type: "Terminal",
                        value: "1",
                    },
                },
            });
        });

    });

    describe('Method: Optional', () => {

        it('can parse optionals', () => {
            const parser = new Parser;
            const source = 'one or negative one = ["-"], "1"};';

            parser.read(source);
            parser.Identifier();
            parser.eat('=');
            const optional = (parser.Optional() as Optional);

            expect(optional.toDictionary()).toStrictEqual({
                type: "Optional",
                value: {
                    type: "Terminal",
                    value: "-",
                },
            });
        });

    });

    describe('Method: Special', () => {

        it('can parse specials', () => {
            const parser = new Parser;
            const source = 'prime = ? prime number ?;';

            parser.read(source);
            parser.Identifier();
            parser.eat('=');
            const specials = parser.Special();

            expect(specials.value).toBe('prime number');
        });

    });

    describe('Method: Terminal', () => {

        it('can parse terminals', () => {
            const parser = new Parser;
            const source = 'zero = "0";';

            parser.read(source);
            parser.Identifier();
            parser.eat('=');
            const terminal = parser.Terminal();

            expect(terminal.value).toBe('0');
        });

    });

});