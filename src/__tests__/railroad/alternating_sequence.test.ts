import { AlternatingSequence } from '../../railroad/alternating_sequence';
import { FakeSVG } from '../../railroad/fake_svg';
import { Options } from '../../railroad/options';
import * as tags from '../../railroad/tags';

describe('Railroad / AlternatingSequence', () => {
    
    describe('Constructor', () => {
        
        it('should throw an error if not exactly two items are provided', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const item3 = new FakeSVG('g');

            expect(() => new AlternatingSequence([item1])).toThrow(RangeError);
            expect(() => new AlternatingSequence([item1, item2, item3])).toThrow(RangeError);
            expect(() => new AlternatingSequence([item1, item2])).not.toThrow();
        });

        it('should set needsSpace to false', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const alternatingSequence = new AlternatingSequence([item1, item2]);
            
            expect(alternatingSequence.needsSpace).toBe(false);
        });

        it('should calculate width correctly based on items', () => {
            const item1 = new FakeSVG('g');
            item1.width = 50;
            item1.needsSpace = true;
            
            const item2 = new FakeSVG('g');
            item2.width = 30;
            item2.needsSpace = true;
            
            const alternatingSequence = new AlternatingSequence([item1, item2]);
            
            expect(alternatingSequence.width).toBeGreaterThan(item1.width + item2.width);
        });

        it('should calculate height, up, and down properties correctly', () => {
            const item1 = new FakeSVG('g');
            item1.height = 100;
            item1.up = 20;
            item1.down = 30;
            
            const item2 = new FakeSVG('g');
            item2.height = 50;
            item2.up = 10;
            item2.down = 15;
            
            const alternatingSequence = new AlternatingSequence([item1, item2]);
            
            expect(alternatingSequence.up).toBeGreaterThan(0);
            expect(alternatingSequence.down).toBeGreaterThan(0);
        });

        it('should add debug attributes when debug option is true', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const options = new Options({ debug: true });
            const alternatingSequence = new AlternatingSequence([item1, item2], options);
            
            expect(alternatingSequence.attributes.get('data-updown')).toBeDefined();
            expect(alternatingSequence.attributes.get('data-type')).toBe('alternating-sequence');
        });

    });

    describe('Method: format', () => {
        
        it('should calculate gaps using determineGaps function', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const alternatingSequence = new AlternatingSequence([item1, item2]);
            
            const pathSpy = jest.spyOn(tags, 'path');
            
            alternatingSequence.format(0, 0, 100);
            
            expect(pathSpy).toHaveBeenCalled();
            
            pathSpy.mockRestore();
        });

        it('should format each item and add to alternating sequence', () => {
            const item1 = new FakeSVG('g');
            item1.width = 50;
            item1.height = 30;
            item1.up = 10;
            item1.down = 20;
            item1.format = jest.fn().mockReturnValue(item1);
            
            const item2 = new FakeSVG('g');
            item2.width = 30;
            item2.height = 20;
            item2.up = 5;
            item2.down = 15;
            item2.format = jest.fn().mockReturnValue(item2);
            
            const alternatingSequence = new AlternatingSequence([item1, item2]);
            
            alternatingSequence.format();
            
            expect(item1.format).toHaveBeenCalled();
            expect(item2.format).toHaveBeenCalled();
        });

        it('should return the alternating sequence itself after formatting', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const alternatingSequence = new AlternatingSequence([item1, item2]);
            
            const result = alternatingSequence.format();
            
            expect(result).toBe(alternatingSequence);
        });

        it('should add multiple paths during formatting', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const alternatingSequence = new AlternatingSequence([item1, item2]);
            
            const addToSpy = jest.spyOn(FakeSVG.prototype, 'addTo');
            alternatingSequence.format();
            
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