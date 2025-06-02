import { ZeroOrMore } from '@railroad/zero_or_more';
import { FakeSVG } from '@railroad/fake_svg';
import { Options } from '@railroad/options';
import { Skip } from '@railroad/skip';
import { OneOrMore } from '@railroad/one_or_more';

describe('Railroad / ZeroOrMore', () => {
    
    describe('Constructor', () => {
        
        it('should initialize with an item', () => {
            const item = new FakeSVG('g');
            const zeroOrMore = new ZeroOrMore(item);

            expect(zeroOrMore).toBeInstanceOf(ZeroOrMore);
            expect(zeroOrMore).toBeInstanceOf(FakeSVG);
            expect(zeroOrMore.tag).toBe('g');
        });

        it('should use default skip as separator when not provided', () => {
            const item = new FakeSVG('g');
            const zeroOrMore = new ZeroOrMore(item);

            // Format should not throw error, which would happen if separator was undefined
            expect(() => zeroOrMore.format()).not.toThrow();
        });

        it('should use custom separator when provided', () => {
            const item = new FakeSVG('g');
            const separator = new FakeSVG('g');
            const zeroOrMore = new ZeroOrMore(item, separator);

            // Format should not throw error
            expect(() => zeroOrMore.format()).not.toThrow();
        });

        it('should use default options when none are provided', () => {
            const item = new FakeSVG('g');
            const zeroOrMore = new ZeroOrMore(item);

            expect(zeroOrMore.options).toBeInstanceOf(Options);
        });

        it('should use custom options when provided', () => {
            const item = new FakeSVG('g');
            const customOptions = new Options({ arcRadius: 15 });
            const zeroOrMore = new ZeroOrMore(item, undefined, customOptions);

            expect(zeroOrMore.options.arcRadius).toBe(15);
        });

        it('should add debug attributes when debug mode is on', () => {
            const item = new FakeSVG('g');
            const options = new Options({ debug: true });
            const zeroOrMore = new ZeroOrMore(item, undefined, options);

            expect(zeroOrMore.attributes.get('data-updown')).toBeDefined();
            expect(zeroOrMore.attributes.get('data-type')).toBe('zero-or-more');
        });

        it('should create and use one or more internally', () => {
            const item = new FakeSVG('g');
            item.width = 50;
            item.height = 30;

            const separator = new FakeSVG('g');
            separator.width = 20;
            separator.height = 20;

            const options = new Options({ arcRadius: 10 });
            const zeroOrMore = new ZeroOrMore(item, separator, options);

            // Since OneOrMore is used internally and skip is true in Optional,
            // we should still have the correct dimensions from OneOrMore
            expect(zeroOrMore.width).toBeGreaterThanOrEqual(50 + 2 * options.arcRadius);
            expect(zeroOrMore.height).toBe(30); // height should match item height
        });

    });

    describe('Method: format', () => {
        
        it('should inherit Optional format behavior', () => {
            const item = new FakeSVG('g');
            item.width = 50;
            item.height = 30;
            item.format = jest.fn().mockReturnValue(item);

            const zeroOrMore = new ZeroOrMore(item);
            const formatResult = zeroOrMore.format();

            expect(formatResult).toBe(zeroOrMore);
            expect(item.format).toHaveBeenCalled();
        });

        it('should add correct paths through Optional', () => {
            const item = new FakeSVG('g');
            item.width = 50;
            item.height = 30;

            const zeroOrMore = new ZeroOrMore(item);
            const addToSpy = jest.spyOn(FakeSVG.prototype, 'addTo');

            zeroOrMore.format();

            const pathAdditions = addToSpy.mock.calls.filter(
                call => (call[0].children as FakeSVG[])
                    .some((child: any) => child.tag === 'path')
            ).length;

            // Should have multiple paths added through Optional and OneOrMore
            expect(pathAdditions).toBeGreaterThan(0);

            addToSpy.mockRestore();
        });
    });

    describe('Method: walk', () => {
        
        it('should walk through all nested elements', () => {
            const item = new FakeSVG('g');
            const separator = new FakeSVG('g');
            const zeroOrMore = new ZeroOrMore(item, separator);

            const callback = jest.fn();
            zeroOrMore.walk(callback);

            // Should call for: 
            // 1. ZeroOrMore itself
            // 2. Skip from Optional
            // 3. OneOrMore instance
            // 4. Original item
            // 5. Separator
            expect(callback).toHaveBeenCalledWith(zeroOrMore);
            expect(callback).toHaveBeenCalledWith(item);
            expect(callback).toHaveBeenCalledWith(separator);
            expect(callback).toHaveBeenCalledTimes(5);
        });

    });

});
