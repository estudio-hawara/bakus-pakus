import { NonTerminal } from '@railroad/non_terminal';
import { Options } from '@railroad/options';
import { Attributes } from '@railroad/attributes';
import * as tags from '@railroad/tags';
import * as utils from '@railroad/utils';

describe('Railroad / NonTerminal', () => {

    describe('Constructor', () => {

        it('should create a group element with non-terminal class', () => {
            const nonTerminal = new NonTerminal('Value');

            expect(nonTerminal).toBeInstanceOf(NonTerminal);
            expect(nonTerminal.tag).toBe('g');
            expect(nonTerminal.attributes.get('class')).toBe('non-terminal');
        });

        it('should initialize properties correctly', () => {
            const text = 'Test';
            const options = new Options({ defaultCharWidth: 8 });
            const nonTerminal = new NonTerminal(text, undefined, options);

            expect(nonTerminal.text).toBe(text);
            expect(nonTerminal.up).toBe(11);
            expect(nonTerminal.down).toBe(11);
            expect(nonTerminal.width).toBe(text.length * options.defaultCharWidth + 20);
            expect(nonTerminal.needsSpace).toBe(true);
        });

        it('should add debug attributes when debug mode is on', () => {
            const options = new Options({ debug: true });
            const nonTerminal = new NonTerminal('Debug', undefined, options);

            expect(nonTerminal.attributes.get('data-updown')).toBe('11 11');
            expect(nonTerminal.attributes.get('data-type')).toBe('non-terminal');
        });

        it('should accept custom attributes', () => {
            const customAttrs = new Attributes({
                href: 'http://example.com',
                title: 'Example NonTerminal'
            });
            const nonTerminal = new NonTerminal('Test', customAttrs);

            expect(nonTerminal.attributes.get('href')).toBe('http://example.com');
            expect(nonTerminal.attributes.get('title')).toBe('Example NonTerminal');
        });
    });

    describe('Getter: text', () => {
        it('should return the stored text', () => {
            const text = 'TestValue';
            const nonTerminal = new NonTerminal(text);

            expect(nonTerminal.text).toBe(text);
        });
    });

    describe('Method: format', () => {
        it('should calculate gaps using determineGaps function', () => {
            const nonTerminal = new NonTerminal('Test');
            const determineGapsSpy = jest.spyOn(utils, 'determineGaps');

            nonTerminal.format(0, 0, 100);

            expect(determineGapsSpy).toHaveBeenCalledWith(100, nonTerminal.width, {});

            determineGapsSpy.mockRestore();
        });

        it('should create paths with correct coordinates', () => {
            const nonTerminal = new NonTerminal('Test');
            const pathSpy = jest.spyOn(tags, 'path');

            nonTerminal.format(10, 20, 100);

            expect(pathSpy).toHaveBeenCalled();
            expect(pathSpy.mock.calls[0][0]).toBe(10); // x for first path
            expect(pathSpy.mock.calls[0][1]).toBe(20); // y for first path

            pathSpy.mockRestore();
        });

        it('should create rect with correct attributes', () => {
            const nonTerminal = new NonTerminal('Test');
            const rectSpy = jest.spyOn(tags, 'rect');

            nonTerminal.format(10, 20, 30);

            expect(rectSpy).toHaveBeenCalledWith(expect.objectContaining({
                x: expect.any(Number),
                y: expect.any(Number),
                width: nonTerminal.width,
                height: nonTerminal.up + nonTerminal.down
            }));

            rectSpy.mockRestore();
        });

        it('should position text correctly', () => {
            const text = 'Test';
            const nonTerminal = new NonTerminal(text);
            const textSpy = jest.spyOn(tags, 'text');

            nonTerminal.format(10, 20, 30);

            expect(textSpy).toHaveBeenCalledWith(text, expect.objectContaining({
                x: expect.any(Number),
                y: expect.any(Number)
            }));

            textSpy.mockRestore();
        });

        it('should wrap text in an anchor when href is provided', () => {
            const text = 'Test';
            const href = 'http://example.com';
            const nonTerminal = new NonTerminal(text, new Attributes({ href }));
            const aSpy = jest.spyOn(tags, 'a');

            nonTerminal.format(10, 20, 30);

            expect(aSpy).toHaveBeenCalledWith(
                { 'xlink:href': href },
                expect.any(Array)
            );

            aSpy.mockRestore();
        });

        it('should add title element when title attribute is provided', () => {
            const titleText = 'Test Title';
            const nonTerminal = new NonTerminal('Test', new Attributes({ title: titleText }));
            const titleSpy = jest.spyOn(tags, 'title');

            nonTerminal.format(10, 20, 30);

            expect(titleSpy).toHaveBeenCalledWith(titleText);

            titleSpy.mockRestore();
        });

        it('should return the non-terminal itself after formatting', () => {
            const nonTerminal = new NonTerminal('Test');
            const result = nonTerminal.format(10, 20, 30);

            expect(result).toBe(nonTerminal);
        });

    });

});
