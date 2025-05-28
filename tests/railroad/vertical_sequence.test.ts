import { VerticalSequence } from '@railroad/vertical_sequence';
import { Terminal } from '@railroad/terminal';
import { Options } from '@railroad/options';

describe('Railroad / VerticalSequence', () => {

    describe('Constructor', () => {

        it('creates a sequence with a single item', () => {
            const terminal = new Terminal('Test');
            const sequence = new VerticalSequence([terminal]);
            
            expect(sequence.items.length).toBe(1);
            expect(sequence.needsSpace).toBe(true);
        });

        it('creates a sequence with multiple items', () => {
            const terminals = [
                new Terminal('First'),
                new Terminal('Second'),
                new Terminal('Third')
            ];
            const sequence = new VerticalSequence(terminals);
            
            expect(sequence.items.length).toBe(3);
            expect(sequence.needsSpace).toBe(true);
        });

        it('throws an error when creating an empty sequence', () => {
            expect(() => {
                new VerticalSequence([]);
            }).toThrow(RangeError);
        });

        it('calculates width correctly for a single item', () => {
            const terminal = new Terminal('Test');
            const sequence = new VerticalSequence([terminal]);
            
            expect(sequence.width).toBeGreaterThan(0);
        });

        it('calculates width correctly for multiple items', () => {
            const terminals = [
                new Terminal('Short'),
                new Terminal('Very Long Terminal')
            ];
            const sequence = new VerticalSequence(terminals);
            
            expect(sequence.width).toBeGreaterThan(0);
        });

        it('uses default options when none are provided', () => {
            const terminal = new Terminal('Test');
            const sequence = new VerticalSequence([terminal]);
            
            expect(sequence.options).toBeDefined();
        });

        it('uses custom options', () => {
            const options = new Options({
                verticalSeparation: 10,
                arcRadius: 5,
                debug: true
            });
            
            const terminal = new Terminal('Test');
            const sequence = new VerticalSequence([terminal], options);
            
            expect(sequence.options.verticalSeparation).toBe(10);
            expect(sequence.options.arcRadius).toBe(5);
            expect(sequence.options.debug).toBe(true);
        });

        it('sets up and down values correctly', () => {
            const terminals = [
                new Terminal('First'),
                new Terminal('Second')
            ];
            const sequence = new VerticalSequence(terminals);
            
            expect(sequence.up).toBe(terminals[0].up);
            expect(sequence.down).toBe(terminals[terminals.length - 1].down);
        });

        it('adds debug attributes when debug is true', () => {
            const options = new Options({ debug: true });
            const terminal = new Terminal('Test');
            const sequence = new VerticalSequence([terminal], options);
            
            expect(sequence.attributes.get('data-updown')).toBe('11 11');
            expect(sequence.attributes.get('data-type')).toBe('vertical-sequence');
        });

    });

    describe('Method: format', () => {

        it('can format a single item', () => {
            const terminal = new Terminal('Test');
            const sequence = new VerticalSequence([terminal]);
            
            const formattedSequence = sequence.format();
            
            expect(formattedSequence).toBe(sequence);
        });

        it('can format multiple items', () => {
            const terminals = [
                new Terminal('First'),
                new Terminal('Second'),
                new Terminal('Third')
            ];
            const sequence = new VerticalSequence(terminals);
            
            const formattedSequence = sequence.format();
            
            expect(formattedSequence).toBe(sequence);
        });

        it('uses default x and y coordinates when not specified', () => {
            const terminal = new Terminal('Test');
            const sequence = new VerticalSequence([terminal]);
            
            const formattedSequence = sequence.format();
            
            expect(formattedSequence).toBe(sequence);
        });

        it('uses custom x and y coordinates', () => {
            const terminal = new Terminal('Test');
            const sequence = new VerticalSequence([terminal]);
            
            const formattedSequence = sequence.format(50, 100);
            
            expect(formattedSequence).toBe(sequence);
        });

        it('uses custom width', () => {
            const terminal = new Terminal('Test');
            const sequence = new VerticalSequence([terminal]);
            
            const formattedSequence = sequence.format(0, 0, 200);
            
            expect(formattedSequence).toBe(sequence);
        });

        it('handles multiple items with different widths', () => {
            const terminals = [
                new Terminal('Short'),
                new Terminal('Very Long Terminal')
            ];
            const sequence = new VerticalSequence(terminals);
            
            const formattedSequence = sequence.format();
            
            expect(formattedSequence).toBe(sequence);
        });

        it('uses custom options', () => {
            const options = new Options({
                verticalSeparation: 10,
                arcRadius: 5,
            });
            
            const terminal = new Terminal('Test');
            const sequence = new VerticalSequence([terminal], options);
            
            const formattedSequence = sequence.format();
            
            expect(formattedSequence).toBe(sequence);
        });

    });

});