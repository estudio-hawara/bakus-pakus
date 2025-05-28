import { Options } from "@railroad/options";
import { Start } from "@railroad/start";

describe('Railroad / Start', () => {

    describe('Constructor', () => {

        it('can be instantiated without a label', () => {
            const tag = 'g';
            const start = new Start('simple');

            expect(start.tag).toBe(tag);
        });

        it('can be instantiated without a label', () => {
            const tag = 'g';
            const label = 'Label';
            const start = new Start('simple', label);

            expect(start.tag).toBe(tag);
            expect(start.label).toBe(label);
        });

        it('should add debug attributes when debug mode is on', () => {
            const options = new Options({ debug: true });
            const start = new Start('simple', undefined, options);

            expect(start.attributes.get('data-updown')).toBe('10 10');
            expect(start.attributes.get('data-type')).toBe('start');
        });

    });

    describe('Method: format', () => {

        it('should render in simple mode', () => {
            const label = 'Label';
            const start = new Start('simple', label);
            const result = start.format(10, 10).toString();

            expect(result).toContain('m 10 -20');
        });

        it('should render in complex mode', () => {
            const label = 'Label';
            const start = new Start('complex', label);
            const result = start.format(10, 10).toString();

            expect(result).toContain('m 0 -10');
        });

    });

});