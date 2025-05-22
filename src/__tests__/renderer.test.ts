import { Renderer } from '../renderer';
import { Parser } from '../parser';

describe('Renderer', () => {

    test('is a class', () => {
        expect(typeof Renderer).toBe('function');
    });

    test('accepts a parser on construction', () => {
        const parser = new Parser;
        expect(() => new Renderer(parser)).not.toThrow(Error);
    });

    test('a default parser is used', () => {
        expect(() => new Renderer).not.toThrow(Error);
    });

});