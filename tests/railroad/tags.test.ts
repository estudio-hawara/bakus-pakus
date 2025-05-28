import { FakeSVG } from '@railroad/fake_svg';
import { Path } from '@railroad/path';
import { title, text, rect, path, a } from '@railroad/tags';

describe('Railroad / Tags / title', () => {

    it('should create a title element', () => {
        const result = title('Example Title');

        expect(result).toBeInstanceOf(FakeSVG);
        expect(result.tag).toBe('title');
        expect(result.attributes.toDictionary()).toStrictEqual({});
    });

    it('should create a title element with text and attributes', () => {
        const attributes = { id: 'title' };
        const result = title('Example Title', attributes);

        expect(result).toBeInstanceOf(FakeSVG);
        expect(result.tag).toBe('title');
        expect(result.attributes.toDictionary()).toStrictEqual(attributes);
    });

});

describe('Railroad / Tags / text', () => {

    it('should create a text element', () => {
        const result = text('Hello, World!');

        expect(result).toBeInstanceOf(FakeSVG);
        expect(result.tag).toBe('text');
        expect(result.attributes.toDictionary()).toStrictEqual({});
    });

    it('should create a text element with text and attributes', () => {
        const attributes = { class: 'text' };
        const result = text('Hello, World!', attributes);

        expect(result).toBeInstanceOf(FakeSVG);
        expect(result.tag).toBe('text');
        expect(result.attributes.toDictionary()).toStrictEqual(attributes);
    });

});

describe('Railroad / Tags / rect', () => {

    it('should create a rect element', () => {
        const result = rect();

        expect(result).toBeInstanceOf(FakeSVG);
        expect(result.tag).toBe('rect');
        expect(result.attributes.toDictionary()).toStrictEqual({});

    });

    it('should create a rect element with attributes', () => {
        const attributes = { width: '100', height: '50', fill: 'blue' };
        const result = rect(attributes);

        expect(result).toBeInstanceOf(FakeSVG);
        expect(result.tag).toBe('rect');
        expect(result.attributes.toDictionary()).toStrictEqual(attributes);
    });

});

describe('Railroad / Tags / path', () => {

    it('should create a path element with x, y', () => {
        const result = path(10, 20);

        expect(result).toBeInstanceOf(Path);
        expect(result.x).toBe(10);
        expect(result.y).toBe(20);
        expect(result.attributes.toDictionary()).toStrictEqual({d: 'M 10 20'});
    });

    it('should create a path element with x, y, and attributes', () => {
        const attributes = { d: 'M10 20 L30 40 Z', stroke: 'red' };
        const result = path(10, 20, attributes);

        expect(result).toBeInstanceOf(Path);
        expect(result.x).toBe(10);
        expect(result.y).toBe(20);
        expect(result.attributes.toDictionary()).toStrictEqual(Object.assign(attributes, {d: 'M 10 20'}));
    });

});

describe('Railroad / Tags / a', () => {

    it('should create an a element', () => {
        const result = a();

        expect(result).toBeInstanceOf(FakeSVG);
        expect(result.tag).toBe('a');
        expect(result.attributes.toDictionary()).toStrictEqual({});
    });

    it('should create an a element with attributes and children', () => {
        const attributes = { href: 'https://example.com' };
        const result = a(attributes, [text('Link Text')]);

        expect(result).toBeInstanceOf(FakeSVG);
        expect(result.tag).toBe('a');
        expect(result.attributes.toDictionary()).toStrictEqual(attributes);
    });

});