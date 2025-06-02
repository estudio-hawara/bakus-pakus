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

        it('should handle integer-like float inputs correctly', () => {
            const items = [new FakeSVG('g'), new FakeSVG('g'), new FakeSVG('g')];

            // These inputs should throw a TypeError
            const nonIntegerInputs = [0.1, 1.5, 2.9999];
            
            nonIntegerInputs.forEach(input => {
                expect(() => new Choice(items, input)).toThrow(TypeError);
            });
        });

    });

    describe('Property: normal', () => {

        it('should return the correct normal index that was set in the constructor', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const item3 = new FakeSVG('g');

            // Test default normal index (0)
            const choice1 = new Choice([item1, item2, item3]);
            expect(choice1.normal).toBe(0);

            // Test specific normal index
            const choice2 = new Choice([item1, item2, item3], 2);
            expect(choice2.normal).toBe(2);
        });

        it('should work with various numeric normal inputs', () => {
            const items = [new FakeSVG('g'), new FakeSVG('g'), new FakeSVG('g'), new FakeSVG('g')];

            // Test different normal indices
            const testCases = [0, 1, 2, 3];
            testCases.forEach(normalIndex => {
                const choice = new Choice(items, normalIndex);
                expect(choice.normal).toBe(normalIndex);
            });
        });

    });

    describe('Method: format', () => {
        
        it('should calculate gaps using the determine gaps function', () => {
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

        it('should return the choice instance when width is zero', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const item3 = new FakeSVG('g');
            const choice = new Choice([item1, item2, item3], 1);
            
            const result = choice.format(0, 0, 0);
            
            expect(result).toBe(choice);
        });

        it('should handle format with non-zero default arguments', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const item3 = new FakeSVG('g');
            const choice = new Choice([item1, item2, item3], 1);
            
            const result = choice.format(10, 20, 100);
            
            expect(result).toBe(choice);
        });

        it('should handle distance from y calculation for items before normal index', () => {
            const item1 = new FakeSVG('g');
            item1.width = 50;
            item1.height = 30;
            item1.up = 10;
            item1.down = 20;

            const item2 = new FakeSVG('g');
            item2.width = 30;
            item2.height = 40;
            item2.up = 15;
            item2.down = 25;

            const item3 = new FakeSVG('g');
            item3.width = 40;
            item3.height = 35;
            item3.up = 12;
            item3.down = 23;

            const options = new Options({ 
                arcRadius: 10, 
                verticalSeparation: 5 
            });
            const choice = new Choice([item1, item2, item3], 2, options);

            // Spy on the method to verify internal calculations
            const formatSpy = jest.spyOn(choice, 'format');
            choice.format();

            expect(formatSpy).toHaveBeenCalled();
            formatSpy.mockRestore();
        });

        it('should handle distance from y calculation for items after normal index', () => {
            const item1 = new FakeSVG('g');
            item1.width = 50;
            item1.height = 30;
            item1.up = 10;
            item1.down = 20;

            const item2 = new FakeSVG('g');
            item2.width = 30;
            item2.height = 40;
            item2.up = 15;
            item2.down = 25;

            const item3 = new FakeSVG('g');
            item3.width = 40;
            item3.height = 35;
            item3.up = 12;
            item3.down = 23;

            const item4 = new FakeSVG('g');
            item4.width = 35;
            item4.height = 25;
            item4.up = 8;
            item4.down = 17;

            const options = new Options({ 
                arcRadius: 10, 
                verticalSeparation: 5 
            });
            const choice = new Choice([item1, item2, item3, item4], 1, options);

            // Spy on the method to verify internal calculations
            const formatSpy = jest.spyOn(choice, 'format');
            choice.format();

            expect(formatSpy).toHaveBeenCalled();
            formatSpy.mockRestore();
        });

        it('should correctly handle edge cases in distance from y calculation', () => {
            const testCases = [
                // Scenario 1: Minimal items
                [
                    { width: 50, height: 30, up: 10, down: 20 },
                    { width: 30, height: 40, up: 15, down: 25 }
                ],
                // Scenario 2: More varied item dimensions
                [
                    { width: 50, height: 30, up: 10, down: 20 },
                    { width: 30, height: 40, up: 15, down: 25 },
                    { width: 40, height: 35, up: 12, down: 23 }
                ],
                // Scenario 3: Extreme dimension differences
                [
                    { width: 10, height: 5, up: 2, down: 3 },
                    { width: 100, height: 80, up: 40, down: 40 },
                    { width: 25, height: 15, up: 7, down: 8 }
                ]
            ];

            testCases.forEach((items, normalIndex) => {
                const fakeSVGItems = items.map(item => {
                    const fakeItem = new FakeSVG('g');
                    fakeItem.width = item.width;
                    fakeItem.height = item.height;
                    fakeItem.up = item.up;
                    fakeItem.down = item.down;
                    return fakeItem;
                });

                const options = new Options({ 
                    arcRadius: 10, 
                    verticalSeparation: 5 
                });
                const choice = new Choice(fakeSVGItems, normalIndex, options);

                // Verify that format doesn't throw an error
                expect(() => choice.format()).not.toThrow();
            });
        });

        it('should handle zero vertical separation', () => {
            const item1 = new FakeSVG('g');
            item1.width = 50;
            item1.height = 30;
            item1.up = 10;
            item1.down = 20;

            const item2 = new FakeSVG('g');
            item2.width = 30;
            item2.height = 40;
            item2.up = 15;
            item2.down = 25;

            const item3 = new FakeSVG('g');
            item3.width = 40;
            item3.height = 35;
            item3.up = 12;
            item3.down = 23;

            const options = new Options({ 
                arcRadius: 10, 
                verticalSeparation: 0 
            });
            const choice = new Choice([item1, item2, item3], 1, options);

            // Verify that format works with zero vertical separation
            expect(() => choice.format()).not.toThrow();
        });

    });

});