import { Factory } from '../factory';

describe('Factory', () => {

    describe('Constructor', () => {

        it('is a class', () => {
            expect(typeof Factory).toBe('function');
        });

    });

    describe('Method: Grammar', () => {

        it('can generate grammar nodes', () => {
            const factory = new Factory;
            const grammar = factory.Grammar(
                [
                    {
                        type: 'Rule',
                        identifier: { type: 'Identifier', value: 'named rule' },
                        rhs: { type: 'Terminal', value: 'Implementation' },
                    }
                ]

            );

            expect(grammar.type).toBe('Grammar');
            expect(grammar.rules).toHaveLength(1);
        });

    });

    describe('Method: Rule', () => {

        it('can generate rule nodes', () => {
            const factory = new Factory;
            const rule = factory.Rule(
                { type: 'Identifier', value: 'named rule' },
                { type: 'Terminal', value: 'Implementation' },
            );

            expect(rule.type).toBe('Rule');
            expect(rule.identifier).toStrictEqual({ type: 'Identifier', value: 'named rule' });
            expect(rule.rhs).toStrictEqual({ type: 'Terminal', value: 'Implementation' });
        });

    });


    describe('Method: Group', () => {

        it('can generate group nodes', () => {
            const factory = new Factory;
            const group = factory.Group({ type: 'Terminal', value: 'Groupable' });

            expect(group.type).toBe('Group');
            expect(group.value).toStrictEqual({ type: 'Terminal', value: 'Groupable' });
        });

    });

    describe('Method: Repetition', () => {

        it('can generate repetition nodes', () => {
            const factory = new Factory;
            const repetition = factory.Repetition({ type: 'Terminal', value: 'Repeatable' });

            expect(repetition.type).toBe('Repetition');
            expect(repetition.value).toStrictEqual({ type: 'Terminal', value: 'Repeatable' });
        });

    });

    describe('Method: Optional', () => {

        it('can generate optional nodes', () => {
            const factory = new Factory;
            const optional = factory.Optional({ type: 'Terminal', value: 'Ignorable' });

            expect(optional.type).toBe('Optional');
            expect(optional.value).toStrictEqual({ type: 'Terminal', value: 'Ignorable' });
        });        

    });

    describe('Method: Special', () => {

        it('can generate special nodes', () => {
            const factory = new Factory;
            const special = factory.Special('Unspeakable');

            expect(special.type).toBe('Special');
            expect(special.value).toBe('Unspeakable');
        });

    });

    describe('Method: Choice', () => {

        it('can generate choice nodes', () => {
            const factory = new Factory;
            const choice = factory.Choice(
                { type: 'Terminal', value: '0' },
                { type: 'Terminal', value: '1' },
            );

            expect(choice.type).toBe('Choice');
            expect(choice.left).toStrictEqual({ type: 'Terminal', value: '0' });
            expect(choice.right).toStrictEqual({ type: 'Terminal', value: '1' });
        });

    });

    describe('Method: Sequence', () => {

        it('can generate sequence nodes', () => {
            const factory = new Factory;
            const sequence = factory.Sequence(
                { type: 'Terminal', value: '0' },
                { type: 'Terminal', value: '1' },
            );

            expect(sequence.type).toBe('Sequence');
            expect(sequence.left).toStrictEqual({ type: 'Terminal', value: '0' });
            expect(sequence.right).toStrictEqual({ type: 'Terminal', value: '1' });
        });

    });

    describe('Method: Identifier', () => {

        it('can generate identifier nodes', () => {
            const factory = new Factory;
            const identifier = factory.Identifier('variable name with spaces');

            expect(identifier.type).toBe('Identifier');
            expect(identifier.value).toBe('variable name with spaces');
        });

    });

    describe('Method: Terminal', () => {

        it('can generate terminal nodes', () => {
            const factory = new Factory;
            const terminal = factory.Terminal('0');

            expect(terminal.type).toBe('Terminal');
            expect(terminal.value).toBe('0');
        });

    });

});