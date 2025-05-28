import { Choice } from '@railroad/choice';
import { FakeSVG } from '@railroad/fake_svg';
import { Options } from '@railroad/options';
import * as tags from '@railroad/tags';

describe('Railroad / Choice', () => {
    
    describe('Constructor', () => {
        
        it('should throw a TypeError if normal is not an integer', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const item3 = new FakeSVG('g');

            expect(() => new Choice([item1, item2, item3], 1.5)).toThrow(TypeError);
        });

        it('should throw a RangeError if normal is out of bounds', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const item3 = new FakeSVG('g');

            expect(() => new Choice([item1, item2, item3], -1)).toThrow(RangeError);
            expect(() => new Choice([item1, item2, item3], 3)).toThrow(RangeError);
        });

        it('should calculate width correctly based on items', () => {
            const item1 = new FakeSVG('g');
            item1.width = 50;
            
            const item2 = new FakeSVG('g');
            item2.width = 30;
            
            const item3 = new FakeSVG('g');
            item3.width = 40;
            
            const item4 = new FakeSVG('g');
            item4.width = 40;

            const options = new Options({ arcRadius: 10 });
            const choice = new Choice([item1, item2, item3, item4], 1, options);
            
            expect(choice.width).toBe(50 + 4 * options.arcRadius);
        });

        it('should consider the normal element when calculating the width', () => {
            const item1 = new FakeSVG('g');
            item1.width = 50;
            
            const item2 = new FakeSVG('g');
            item2.width = 30;
            
            const item3 = new FakeSVG('g');
            item3.width = 40;
            
            const options = new Options({ arcRadius: 10 });
            const choice = new Choice([item1, item2, item3], 2, options);
            
            expect(choice.width).toBe(50 + 4 * options.arcRadius);
        });

        it('should calculate height based on the normal item', () => {
            const item1 = new FakeSVG('g');
            item1.height = 20;
            
            const item2 = new FakeSVG('g');
            item2.height = 50;
            
            const item3 = new FakeSVG('g');
            item3.height = 30;
            
            const choice = new Choice([item1, item2, item3], 1);
            
            expect(choice.height).toBe(50);
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
            const choice = new Choice([item1, item2, item3], 1, options);
            
            expect(choice.up).toBe(70);
            expect(choice.down).toBe(50);
        });

        it('should add debug attributes when debug option is true', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const item3 = new FakeSVG('g');
            const options = new Options({ debug: true });
            const choice = new Choice([item1, item2, item3], 1, options);
            
            expect(choice.attributes.get('data-updown')).toBeDefined();
            expect(choice.attributes.get('data-type')).toBe('choice');
        });

    });

    describe('Method: format', () => {
        
        it('should calculate gaps using determineGaps function', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const item3 = new FakeSVG('g');
            const choice = new Choice([item1, item2, item3], 1);
            
            const pathSpy = jest.spyOn(tags, 'path');
            
            choice.format(0, 0, 100);
            
            expect(pathSpy).toHaveBeenCalled();
            
            pathSpy.mockRestore();
        });

        it('should format each item and add to choice', () => {
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
            
            const choice = new Choice([item1, item2, item3], 1);
            
            choice.format();
            
            expect(item1.format).toHaveBeenCalled();
            expect(item2.format).toHaveBeenCalled();
            expect(item3.format).toHaveBeenCalled();
        });

        it('should return the choice itself after formatting', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const item3 = new FakeSVG('g');
            const choice = new Choice([item1, item2, item3], 1);
            
            const result = choice.format();
            
            expect(result).toBe(choice);
        });

        it('should add multiple paths during formatting', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const item3 = new FakeSVG('g');
            const choice = new Choice([item1, item2, item3], 1);
            
            const addToSpy = jest.spyOn(FakeSVG.prototype, 'addTo');
            choice.format();
            
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