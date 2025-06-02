import { OneOrMore } from '@railroad/one_or_more';
import { FakeSVG } from '@railroad/fake_svg';
import { Options } from '@railroad/options';
import { Skip } from '@railroad/skip';
import * as tags from '@railroad/tags';

describe('Railroad / OneOrMore', () => {
    
    describe('Constructor', () => {
        
        it('should initialize with an item and optional separator', () => {
            const item = new FakeSVG('g');
            const oneOrMore = new OneOrMore(item);
            
            expect(oneOrMore).toBeInstanceOf(OneOrMore);
            expect(oneOrMore.tag).toBe('g');
            expect(oneOrMore.needsSpace).toBe(true);
        });
        
        it('should calculate width correctly based on items and arc radius', () => {
            const item = new FakeSVG('g');
            item.width = 50;
            
            const separator = new FakeSVG('g');
            separator.width = 30;
            
            const options = new Options({ arcRadius: 10 });
            const oneOrMore = new OneOrMore(item, separator);
            
            // Width should be max of item or separator width plus 2 * arcRadius
            expect(oneOrMore.width).toBe(50 + 2 * options.arcRadius);
        });
        
        it('should default separator to Skip instance', () => {
            const item = new FakeSVG('g');
            const oneOrMore = new OneOrMore(item);
            
            // Format should not throw error, which would happen if separator was undefined
            expect(() => oneOrMore.format()).not.toThrow();
        });
        
        it('should calculate up and down correctly', () => {
            const item = new FakeSVG('g');
            item.up = 20;
            item.down = 10;
            
            const separator = new FakeSVG('g');
            separator.up = 15;
            separator.height = 20;
            separator.down = 25;
            
            const options = new Options({ arcRadius: 5, verticalSeparation: 10 });
            const oneOrMore = new OneOrMore(item, separator, options);
            
            expect(oneOrMore.up).toBe(item.up);
            expect(oneOrMore.down).toBe(item.down + options.verticalSeparation + separator.up + separator.height + separator.down);
        });
        
        it('should add debug attributes when debug mode is on', () => {
            const item = new FakeSVG('g');
            const options = new Options({ debug: true });
            const oneOrMore = new OneOrMore(item, undefined, options);
            
            expect(oneOrMore.attributes.get('data-updown')).toBeDefined();
            expect(oneOrMore.attributes.get('data-type')).toBe('one-or-more');
        });
        
    });
    
    describe('Method: format', () => {
        
        it('should calculate gaps using determineGaps function', () => {
            const item = new FakeSVG('g');
            const oneOrMore = new OneOrMore(item);
            
            oneOrMore.format(0, 0, 100);
            
            // Since determineGaps is used internally, we can verify the paths are added
            const paths = (oneOrMore.children as FakeSVG[]).filter(child => child instanceof FakeSVG && child.tag === 'path');
            expect(paths.length).toBeGreaterThan(0);
        });
        
        it('should format item and add to one-or-more', () => {
            const item = new FakeSVG('g');
            item.width = 50;
            item.height = 30;
            item.format = jest.fn().mockReturnValue(item);
            
            const oneOrMore = new OneOrMore(item);
            
            oneOrMore.format();
            
            expect(item.format).toHaveBeenCalled();
        });
        
        it('should add arc radius paths for loop back', () => {
            const item = new FakeSVG('g');
            const oneOrMore = new OneOrMore(item);
            
            const addToSpy = jest.spyOn(FakeSVG.prototype, 'addTo');
            
            oneOrMore.format();
            
            const pathAdditions = addToSpy.mock.calls.filter(
                call => 
                    (call[0].children as FakeSVG[])
                        .some((child: any) => child.tag === 'path'
                )
            ).length;
            
            expect(pathAdditions).toBeGreaterThan(0);
            
            addToSpy.mockRestore();
        });
        
        it('should format separator and add to one-or-more', () => {
            const item = new FakeSVG('g');
            item.height = 30;
            
            const separator = new FakeSVG('g');
            separator.height = 20;
            separator.format = jest.fn().mockReturnValue(separator);
            
            const oneOrMore = new OneOrMore(item, separator);
            
            oneOrMore.format();
            
            expect(separator.format).toHaveBeenCalled();
        });
        
        it('should return the one-or-more itself after formatting', () => {
            const item = new FakeSVG('g');
            const oneOrMore = new OneOrMore(item);
            
            const result = oneOrMore.format();
            
            expect(result).toBe(oneOrMore);
        });
        
    });
    
    describe('Method: walk', () => {
        
        it('should call callback for itself, item, and separator', () => {
            const item = new FakeSVG('g');
            const separator = new FakeSVG('g');
            const oneOrMore = new OneOrMore(item, separator);
            
            const callback = jest.fn();
            oneOrMore.walk(callback);
            
            expect(callback).toHaveBeenCalledTimes(3);
            expect(callback).toHaveBeenCalledWith(oneOrMore);
            expect(callback).toHaveBeenCalledWith(item);
            expect(callback).toHaveBeenCalledWith(separator);
        });
        
    });
    
});
