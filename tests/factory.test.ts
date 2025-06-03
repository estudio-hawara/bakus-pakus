import { Factory, Identifier, Rule, Terminal } from '@app/factory';

describe('Factory', () => {

    describe('Constructor', () => {

        it('is a class', () => {
            expect(typeof Factory).toBe('function');
        });

    });

    describe('Method: Grammar', () => {

        it('can generate grammar nodes', () => {
            const factory = new Factory;
            const grammar = factory.Grammar([
                new Rule(
                    new Identifier('named rule'),
                    new Terminal('Implementation'),
                ),
            ]);

            expect(grammar.rules).toHaveLength(1);
        });

    });

    describe('Method: Rule', () => {

        it('can generate rule nodes', () => {
            const factory = new Factory;
            const rule = factory.Rule(
                new Identifier('named rule'),
                new Terminal('Implementation'),
            );

            expect(rule.identifier.toDictionary()).toStrictEqual({ type: 'Identifier', value: 'named rule' });
            expect(rule.value.toDictionary()).toStrictEqual({ type: 'Terminal', value: 'Implementation' });
        });

    });

    describe('Method: Group', () => {

        it('can generate group nodes', () => {
            const factory = new Factory;
            const group = factory.Group(
                new Terminal('Groupable')
            );

            expect(group.value.toDictionary()).toStrictEqual({ type: 'Terminal', value: 'Groupable' });
        });

    });

    describe('Method: Repetition', () => {

        it('can generate repetition nodes', () => {
            const factory = new Factory;
            const repetition = factory.Repetition(
                new Terminal('Repeatable')
            );

            expect(repetition.value.toDictionary()).toStrictEqual({ type: 'Terminal', value: 'Repeatable' });
        });

    });

    describe('Method: Optional', () => {

        it('can generate optional nodes', () => {
            const factory = new Factory;
            const optional = factory.Optional(
                new Terminal('Ignorable')
            );

            expect(optional.value.toDictionary()).toStrictEqual({ type: 'Terminal', value: 'Ignorable' });
        });        

    });

    describe('Method: Special', () => {

        it('can generate special nodes', () => {
            const factory = new Factory;
            const special = factory.Special('Unspeakable');

            expect(special.value).toBe('Unspeakable');
        });

    });

    describe('Method: Choice', () => {

        it('can generate choice nodes', () => {
            const factory = new Factory;
            const choice = factory.Choice(
                new Terminal('0'),
                new Terminal('1'),
            );

            expect(choice.left.toDictionary()).toStrictEqual({ type: 'Terminal', value: '0' });
            expect(choice.right.toDictionary()).toStrictEqual({ type: 'Terminal', value: '1' });
        });

    });

    describe('Method: Sequence', () => {

        it('can generate sequence nodes', () => {
            const factory = new Factory;
            const sequence = factory.Sequence(
                new Terminal('0'),
                new Terminal('1'),
            );

            expect(sequence.left.toDictionary()).toStrictEqual({ type: 'Terminal', value: '0' });
            expect(sequence.right.toDictionary()).toStrictEqual({ type: 'Terminal', value: '1' });
        });

    });

    describe('Method: Identifier', () => {

        it('can generate identifier nodes', () => {
            const factory = new Factory;
            const identifier = factory.Identifier('variable name with spaces');

            expect(identifier.value).toBe('variable name with spaces');
        });

    });

    describe('Method: Terminal', () => {

        it('can generate terminal nodes', () => {
            const factory = new Factory;
            const terminal = factory.Terminal('0');

            expect(terminal.value).toBe('0');
        });

    });

});