import { Factory } from '../factory';

describe('Factory', () => {

    test('is a class', () => {
        expect(typeof Factory).toBe('function');
    });

    test('can generate terminal nodes', () => {
        const factory = new Factory;
        const terminal = factory.Terminal('0');

        expect(terminal.type).toBe('Terminal');
        expect(terminal.value).toBe('0');
    });

    test('can generate group nodes', () => {
        const factory = new Factory;
        const terminal = factory.Terminal('0');
        const group = factory.Group(terminal);

        expect(group.type).toBe('Group');
        expect(group.value).toStrictEqual({ type: 'Terminal', value: '0' });
    });

    test('can generate repetition nodes', () => {
        const factory = new Factory;
        const terminal = factory.Terminal('0');
        const repetition = factory.Repetition(terminal);

        expect(repetition.type).toBe('Repetition');
        expect(repetition.value).toStrictEqual({ type: 'Terminal', value: '0' });
    });

    test('can generate optional nodes', () => {
        const factory = new Factory;
        const terminal = factory.Terminal('0');
        const optional = factory.Optional(terminal);

        expect(optional.type).toBe('Optional');
        expect(optional.value).toStrictEqual({ type: 'Terminal', value: '0' });
    });

});