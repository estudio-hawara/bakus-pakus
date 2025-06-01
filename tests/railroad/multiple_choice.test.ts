import { MultipleChoice } from '@railroad/multiple_choice';
import { FakeSVG } from '@railroad/fake_svg';
import { Options } from '@railroad/options';
import * as tags from '@railroad/tags';
import * as utils from '@railroad/utils';

describe('Railroad / MultipleChoice', () => {
    
    describe('Constructor', () => {
        
        it('should throw a TypeError if normal is not an integer', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const item3 = new FakeSVG('g');

            expect(() => new MultipleChoice([item1, item2, item3], 1.5)).toThrow(TypeError);
        });

        it('should throw a RangeError if normal is out of bounds', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const item3 = new FakeSVG('g');

            expect(() => new MultipleChoice([item1, item2, item3], -1)).toThrow(RangeError);
            expect(() => new MultipleChoice([item1, item2, item3], 3)).toThrow(RangeError);
        });

        it('should throw a TypeError if type is invalid', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');

            expect(() => new MultipleChoice([item1, item2], 0, 'invalid' as any)).toThrow(TypeError);
        });

        it('should calculate width correctly based on items', () => {
            const item1 = new FakeSVG('g');
            item1.width = 50;
            
            const item2 = new FakeSVG('g');
            item2.width = 30;
            
            const item3 = new FakeSVG('g');
            item3.width = 40;

            const options = new Options({ arcRadius: 10 });
            const multipleChoice = new MultipleChoice([item1, item2, item3], 1, 'any', options);
            
            expect(multipleChoice.width).toBe(50 + 2 * options.arcRadius + item1.width);
        });

        it('should calculate height based on the normal item', () => {
            const item1 = new FakeSVG('g');
            item1.height = 20;
            
            const item2 = new FakeSVG('g');
            item2.height = 50;
            
            const item3 = new FakeSVG('g');
            item3.height = 30;
            
            const multipleChoice = new MultipleChoice([item1, item2, item3], 1);
            
            expect(multipleChoice.height).toBe(50);
        });

        it('should calculate up and down properties correctly', () => {
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
            item3.up = 5;
            item3.down = 15;
            
            const options = new Options({ arcRadius: 10, verticalSeparation: 20 });
            const multipleChoice = new MultipleChoice([item1, item2, item3], 1, 'any', options);
            
            expect(multipleChoice.up).toBeGreaterThanOrEqual(item1.up);
            expect(multipleChoice.down).toBeGreaterThanOrEqual(item3.down);
        });

        it('should set needs space to true', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const multipleChoice = new MultipleChoice([item1, item2]);
            
            expect(multipleChoice.needsSpace).toBe(true);
        });

        it('should add debug attributes when debug option is true', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const item3 = new FakeSVG('g');
            const options = new Options({ debug: true });
            const multipleChoice = new MultipleChoice([item1, item2, item3], 1, 'any', options);
            
            expect(multipleChoice.attributes.get('data-updown')).toBeDefined();
            expect(multipleChoice.attributes.get('data-type')).toBe('multiple-choice');
        });

    });

    describe('Method: format', () => {
        
        it('should call determineGaps with correct parameters', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const item3 = new FakeSVG('g');
            const multipleChoice = new MultipleChoice([item1, item2, item3], 1);
            
            const determineGapsSpy = jest.spyOn(utils, 'determineGaps');
            
            multipleChoice.format(0, 0, 100);
            
            expect(determineGapsSpy).toHaveBeenCalledWith(100, multipleChoice.width);
            
            determineGapsSpy.mockRestore();
        });

        it('should format each item and add to multiple choice', () => {
            const item1 = new FakeSVG('g');
            item1.width = 50;
            item1.height = 30;
            item1.up = 10;
            item1.down = 20;
            item1.format = jest.fn().mockReturnValue(item1);
            
            const item2 = new FakeSVG('g');
            item2.width = 30;
            item2.height = 40;
            item2.up = 15;
            item2.down = 25;
            item2.format = jest.fn().mockReturnValue(item2);
            
            const item3 = new FakeSVG('g');
            item3.width = 40;
            item3.height = 35;
            item3.up = 12;
            item3.down = 23;
            item3.format = jest.fn().mockReturnValue(item3);
            
            const multipleChoice = new MultipleChoice([item1, item2, item3], 1);
            
            multipleChoice.format();
            
            expect(item1.format).toHaveBeenCalled();
            expect(item2.format).toHaveBeenCalled();
            expect(item3.format).toHaveBeenCalled();
        });

        it('should test type-specific text elements', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            
            const anyChoice = new MultipleChoice([item1, item2], 0, 'any');
            const allChoice = new MultipleChoice([item1, item2], 0, 'all');
            
            const textSpy = jest.spyOn(tags, 'text');
            const titleSpy = jest.spyOn(tags, 'title');
            
            anyChoice.format();
            expect(textSpy).toHaveBeenCalledWith('1+', expect.any(Object));
            expect(titleSpy).toHaveBeenCalledWith('take one or more branches, once each, in any order');
            
            allChoice.format();
            expect(textSpy).toHaveBeenCalledWith('all', expect.any(Object));
            expect(titleSpy).toHaveBeenCalledWith('take all branches, once each, in any order');
            
            textSpy.mockRestore();
            titleSpy.mockRestore();
        });

        it('should return the multiple choice itself after formatting', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const item3 = new FakeSVG('g');
            const multipleChoice = new MultipleChoice([item1, item2, item3], 1);
            
            const result = multipleChoice.format();
            
            expect(result).toBe(multipleChoice);
        });

        it('should add multiple paths during formatting', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const item3 = new FakeSVG('g');
            const multipleChoice = new MultipleChoice([item1, item2, item3], 1);
            
            const addToSpy = jest.spyOn(FakeSVG.prototype, 'addTo');
            multipleChoice.format();
            
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
