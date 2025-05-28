import { Options } from "@railroad/options";
import { End } from "@railroad/end";

describe('Railroad / End', () => {

    describe('Constructor', () => {

        it('can be instantiated without a label', () => {
            const end = new End('simple');

            expect(end.tag).toBe('path');
        });

        it('should add debug attributes when debug mode is on', () => {
            const options = new Options({ debug: true });
            const start = new End('simple', options);

            expect(start.attributes.get('data-updown')).toBe('10 10');
            expect(start.attributes.get('data-type')).toBe('end');
        });

    });

    describe('Method: format', () => {

        it('should render in simple mode', () => {
            const start = new End('simple');
            const result = start.format(10, 10).toString();

            expect(result).toContain('m 10 -20');
        });

        it('should render in complex mode', () => {
            const start = new End('complex');
            const result = start.format(10, 10).toString();

            expect(result).toContain('m 0 -10');
        });

    });

});