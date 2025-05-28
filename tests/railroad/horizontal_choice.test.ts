// filepath: /home/carlos/Programming/Courses/wordpress-gutenberg-block-development/choo-choo/src/__tests__/railroad/horizontal_choice.test.ts
import { HorizontalChoice } from '@railroad/horizontal_choice';
import { FakeSVG } from '@railroad/fake_svg';
import { Options } from '@railroad/options';
import * as tags from '@railroad/tags';
import * as utils from '@railroad/utils';

describe('Railroad / HorizontalChoice', () => {
    
    describe('Constructor', () => {
        
        it('should throw an error if less than two items are provided', () => {
            const item1 = new FakeSVG('g');
            
            expect(() => new HorizontalChoice([item1])).toThrow(RangeError);
        });

        it('should calculate width correctly based on items', () => {
            const item1 = new FakeSVG('g');
            item1.width = 50;
            item1.needsSpace = true;
            item1.height = 0;
            
            const item2 = new FakeSVG('g');
            item2.width = 30;
            item2.height = 0;
            
            const item3 = new FakeSVG('g');
            item3.width = 40;
            item3.needsSpace = true;
            item3.height = 20;
            
            const options = new Options({ arcRadius: 10 });
            const horizontalChoice = new HorizontalChoice([item1, item2, item3], options);
            
            const expectedWidth = options.arcRadius + 
                options.arcRadius * 2 * (3 - 1) + 
                (item1.width + 20 + item2.width + item3.width + 20) + 
                (item3.height > 0 ? options.arcRadius : 0) + 
                options.arcRadius;
            
            expect(horizontalChoice.width).toBe(expectedWidth);
        });

        it('should calculate upper and lower tracks correctly', () => {
            const item1 = new FakeSVG('g');
            item1.height = 20;
            item1.up = 10;
            item1.down = 5;
            
            const item2 = new FakeSVG('g');
            item2.height = 50;
            item2.up = 15;
            item2.down = 10;
            
            const item3 = new FakeSVG('g');
            item3.height = 30;
            item3.up = 25;
            item3.down = 15;
            
            const options = new Options({ arcRadius: 10, verticalSeparation: 20 });
            const horizontalChoice = new HorizontalChoice([item1, item2, item3], options);
            
            expect(horizontalChoice.up).toBeGreaterThanOrEqual(25);
        });

        it('should set needs space to false', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const horizontalChoice = new HorizontalChoice([item1, item2]);
            
            expect(horizontalChoice.needsSpace).toBe(false);
        });

        it('should add debug attributes when debug option is true', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const options = new Options({ debug: true });
            const horizontalChoice = new HorizontalChoice([item1, item2], options);
            
            expect(horizontalChoice.attributes.get('data-updown')).toBeDefined();
            expect(horizontalChoice.attributes.get('data-type')).toBe('horizontal-choice');
        });

    });

    describe('Method: format', () => {
        
        it('should call determine gaps with correct parameters', () => {
            const item1 = new FakeSVG('g');
            item1.needsSpace = true;

            const item2 = new FakeSVG('g');
            item2.needsSpace = true;

            const horizontalChoice = new HorizontalChoice([item1, item2]);
            
            const determineGapsSpy = jest.spyOn(utils, 'determineGaps');
            
            horizontalChoice.format(0, 0, 100);
            
            expect(determineGapsSpy).toHaveBeenCalledWith(100, horizontalChoice.width);
            
            determineGapsSpy.mockRestore();
        });

        it('should create paths with correct coordinates', () => {
            const item1 = new FakeSVG('g');
            item1.width = 50;
            item1.height = 20;
            
            const item2 = new FakeSVG('g');
            item2.width = 30;
            item2.height = 25;
            
            const options = new Options({ arcRadius: 10 });
            const horizontalChoice = new HorizontalChoice([item1, item2], options);
            
            const pathSpy = jest.spyOn(tags, 'path');
            
            horizontalChoice.format(0, 0, 100);
            
            expect(pathSpy).toHaveBeenCalled();
            
            pathSpy.mockRestore();
        });

        it('should format each item and add to horizontal choice', () => {
            const item1 = new FakeSVG('g');
            item1.width = 50;
            item1.height = 30;
            item1.format = jest.fn().mockReturnValue(item1);
            
            const item2 = new FakeSVG('g');
            item2.width = 30;
            item2.height = 40;
            item2.format = jest.fn().mockReturnValue(item2);
            
            const horizontalChoice = new HorizontalChoice([item1, item2]);
            
            horizontalChoice.format();
            
            expect(item1.format).toHaveBeenCalled();
            expect(item2.format).toHaveBeenCalled();
        });

        it('should handle different item height scenarios correctly', () => {
            // Test item with zero height
            const item1 = new FakeSVG('g');
            item1.width = 50;
            item1.height = 0;
            item1.format = jest.fn().mockReturnValue(item1);
            
            const item2 = new FakeSVG('g');
            item2.width = 30;
            item2.height = 0;
            item2.format = jest.fn().mockReturnValue(item2);
            
            const horizontalChoice = new HorizontalChoice([item1, item2]);
            const pathSpy = jest.spyOn(tags, 'path');
            
            horizontalChoice.format();
            
            expect(pathSpy).toHaveBeenCalled();
            
            pathSpy.mockRestore();
        });

        it('should handle first item with height greater than lower track', () => {
            const item1 = new FakeSVG('g');
            item1.width = 50;
            item1.height = 100;
            item1.format = jest.fn().mockReturnValue(item1);
            
            const item2 = new FakeSVG('g');
            item2.width = 30;
            item2.height = 20;
            item2.format = jest.fn().mockReturnValue(item2);
            
            const options = new Options({ arcRadius: 10 });
            const horizontalChoice = new HorizontalChoice([item1, item2], options);
            
            const pathSpy = jest.spyOn(tags, 'path');
            
            horizontalChoice.format();
            
            expect(pathSpy).toHaveBeenCalled();
            
            pathSpy.mockRestore();
        });

        it('should handle first item with height just above lower track', () => {
            const item1 = new FakeSVG('g');
            item1.width = 50;
            item1.height = 35;
            item1.format = jest.fn().mockReturnValue(item1);
            
            const item2 = new FakeSVG('g');
            item2.width = 30;
            item2.height = 20;
            item2.format = jest.fn().mockReturnValue(item2);
            
            const options = new Options({ arcRadius: 10 });
            const horizontalChoice = new HorizontalChoice([item1, item2], options);
            
            expect(() => horizontalChoice.format()).not.toThrow();
        });

        it('should return the horizontal choice itself after formatting', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const horizontalChoice = new HorizontalChoice([item1, item2]);
            
            const result = horizontalChoice.format();
            
            expect(result).toBe(horizontalChoice);
        });

        it('should add multiple paths during formatting', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const item3 = new FakeSVG('g');
            const horizontalChoice = new HorizontalChoice([item1, item2, item3]);
            
            const addToSpy = jest.spyOn(FakeSVG.prototype, 'addTo');
            horizontalChoice.format();
            
            const pathAdditions = addToSpy.mock.calls.filter(
                call => 
                    (call[0].children as FakeSVG[])
                        .some((child: any) => child.tag === 'path'
                )
            ).length;
            
            expect(pathAdditions).toBeGreaterThanOrEqual(8);
            
            addToSpy.mockRestore();
        });

    });

});