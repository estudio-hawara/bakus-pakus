import { Stack } from '../../railroad/stack';
import { FakeSVG } from '../../railroad/fake_svg';
import { Options } from '../../railroad/options';
import * as tags from '../../railroad/tags';

describe('Railroad / Stack', () => {
    
    describe('Constructor', () => {
        
        it('should throw an error if no items are provided', () => {
            expect(() => new Stack([])).toThrow(RangeError);
        });
        
        it('should add arc radius to width when having multiple items', () => {
            const item1 = new FakeSVG('g');
            item1.width = 50;
            
            const item2 = new FakeSVG('g');
            item2.width = 30;
            
            const options = new Options({ arcRadius: 10 });
            const stack = new Stack([item1, item2], options);
            
            expect(stack.width).toBe(10);
        });
        
        it('should set needsSpace to true', () => {
            const item = new FakeSVG('g');
            const stack = new Stack([item]);
            
            expect(stack.needsSpace).toBe(true);
        });
        
        it('should calculate up and down correctly', () => {
            const item1 = new FakeSVG('g');
            item1.up = 20;
            item1.down = 10;
            
            const item2 = new FakeSVG('g');
            item2.up = 15;
            item2.down = 25;
            
            const options = new Options({ arcRadius: 5, verticalSeparation: 10 });
            const stack = new Stack([item1, item2], options);
            
            expect(stack.up).toBe(item1.up);
            expect(stack.down).toBe(item2.down);
        });
        
        it('should calculate height with vertical separation and arc radius', () => {
            const item1 = new FakeSVG('g');
            item1.height = 50;
            item1.up = 10;
            item1.down = 20;
            
            const item2 = new FakeSVG('g');
            item2.height = 30;
            item2.up = 15;
            item2.down = 25;
            
            const options = new Options({ arcRadius: 5, verticalSeparation: 10 });
            const stack = new Stack([item1, item2], options);
            
            const expectedHeight = 
                item1.height + 
                item2.height + 
                Math.max(options.arcRadius * 2, item1.down + options.verticalSeparation) +
                Math.max(options.arcRadius * 2, item2.up + options.verticalSeparation);
            
            expect(stack.height).toBe(expectedHeight);
        });
        
        it('should add debug attributes when debug option is true', () => {
            const item = new FakeSVG('g');
            const options = new Options({ debug: true });
            const stack = new Stack([item], options);
            
            expect(stack.attributes.get('data-updown')).toBeDefined();
            expect(stack.attributes.get('data-type')).toBe('stack');
        });

    });
    
    describe('Method: format', () => {

        it('should calculate gaps using determineGaps function', () => {
            const item = new FakeSVG('g');
            const stack = new Stack([item]);
            
            const pathSpy = jest.spyOn(tags, 'path');
            
            stack.format(0, 0, 100);
            
            expect(pathSpy).toHaveBeenCalled();
            
            pathSpy.mockRestore();
        });

        it('should add arc radius paths for multiple items', () => {
            const item1 = new FakeSVG('g');
            item1.width = 50;
            item1.height = 30;
            item1.format = jest.fn().mockReturnValue(item1);
            
            const item2 = new FakeSVG('g');
            item2.width = 30;
            item2.height = 20;
            item2.format = jest.fn().mockReturnValue(item2);
            
            const options = new Options({ arcRadius: 10 });
            const stack = new Stack([item1, item2], options);
            
            const addToSpy = jest.spyOn(FakeSVG.prototype, 'addTo');
            
            stack.format();
            
            const pathAdditions = addToSpy.mock.calls.filter(
                call => (call[0].children as FakeSVG[])
                    .some((child: any) => child.tag === 'path'
                )
            ).length;
            
            expect(pathAdditions).toBeGreaterThanOrEqual(5);
            
            addToSpy.mockRestore();
        });

        it('should format each item with correct width', () => {
            const item1 = new FakeSVG('g');
            item1.width = 50;
            item1.height = 30;
            item1.format = jest.fn().mockReturnValue(item1);
            
            const item2 = new FakeSVG('g');
            item2.width = 30;
            item2.height = 20;
            item2.format = jest.fn().mockReturnValue(item2);
            
            const options = new Options({ arcRadius: 10 });
            const stack = new Stack([item1, item2], options);
            
            stack.format();
            
            expect(item1.format).toHaveBeenCalledWith(
                expect.any(Number), 
                expect.any(Number), 
                stack.width - (options.arcRadius * 2)
            );
            
            expect(item2.format).toHaveBeenCalledWith(
                expect.any(Number), 
                expect.any(Number), 
                stack.width - (options.arcRadius * 2)
            );
        });
        
        it('should return the stack itself after formatting', () => {
            const item = new FakeSVG('g');
            const stack = new Stack([item]);
            
            const result = stack.format();
            
            expect(result).toBe(stack);
        });

    });

});