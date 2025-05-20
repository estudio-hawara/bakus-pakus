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

});