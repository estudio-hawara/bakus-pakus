import { Terminal, wrapString } from '../../railroad/terminal';
import { Options } from '../../railroad/options';
import { FakeSVG } from '../../railroad/fake_svg';

describe('Railroad / Terminal', () => {

    describe('Constructor', () => {

        it('should create a group element with terminal class', () => {
            const terminal = new Terminal('Value');

            expect(terminal).toBeInstanceOf(Terminal);
            expect(terminal.text).toBe('Value');
        });

        it('should add debug attributes when debug mode is on', () => {
            const debug = new Options({ debug: true });
            const terminal = new Terminal('Debug Terminal', undefined, debug);

            expect(terminal.attributes.get('data-updown')).toBe('11 11');
            expect(terminal.attributes.get('data-type')).toBe('terminal');
        });

    });

    describe('Getter: text', () => {

        it('its text should be accessible', () => {
            const terminal = new Terminal('Value');

            expect(terminal).toBeInstanceOf(Terminal);
            expect(terminal.text).toBe('Value');
        });

    });

    describe('Getter: width', () => {

        it('its width should be accessible', () => {
            const charWidth = new Options({ defaultCharWidth: 5 });
            const terminal = new Terminal('Value', {}, charWidth);

            expect(terminal).toBeInstanceOf(Terminal);
            expect(terminal.width).toBe(5 * 5 + 20);
        });

    });

    describe('Getter: up', () => {

        it('its up value should be accessible', () => {
            const terminal = new Terminal('Value');

            expect(terminal).toBeInstanceOf(Terminal);
            expect(terminal.up).toBe(11);
        });

    });

    describe('Getter: down', () => {

        it('its down value should be accessible', () => {
            const terminal = new Terminal('Value');

            expect(terminal).toBeInstanceOf(Terminal);
            expect(terminal.down).toBe(11);
        });

    });

    describe('Method: format', () => {

        it('should create path elements for left and right gaps', () => {
            const x = 100;
            const y = 200;
            const width = 300;

            const terminal = new Terminal('Value');
            const result = terminal.format(x, y, width);

            expect(result).toBeInstanceOf(Terminal);
            expect(result.attributes.toDictionary()).toStrictEqual({class: 'terminal'});
            expect(result.toString()).toContain('<path d="M 100 200');
            expect(result.toString()).toContain('Value');
        });

        it('should render the text as a link if href was provided', () => {
            const terminal = new Terminal('Value', { href: '#' });
            const result = terminal.format(100, 200, 300);

            expect(result).toBeInstanceOf(Terminal);
            expect(result.attributes.toDictionary()).toStrictEqual({class: 'terminal', href: '#'});
            expect(result.toString()).toContain('<a xlink:href="#"><text');
            expect(result.toString()).toContain('Value');
        });

        it('should render a title if provided', () => {
            const terminal = new Terminal('Value', { title: 'Important' });
            const result = terminal.format(100, 200, 300);

            expect(result).toBeInstanceOf(Terminal);
            expect(result.attributes.toDictionary()).toStrictEqual({class: 'terminal', title: 'Important'});
            expect(result.toString()).toContain('<title>Important');
            expect(result.toString()).toContain('Value');
        });

    });

});

describe('Railroad / Utils / wrapString', () => {

    it('returns the original value if it was a fake svg instance', () => {
        const value = new FakeSVG('svg');
        const result = wrapString(value);

        expect(result).toBeInstanceOf(FakeSVG);
        expect(result.tag).toBe('svg');
    });

    it('returns a terminal if it receives a string', () => {
        const value = 'String to wrap';
        const result = wrapString(value);

        expect(result).toBeInstanceOf(Terminal);
        expect((result as Terminal).text).toBe(value);
    });

});