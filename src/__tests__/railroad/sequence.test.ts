import { Sequence } from '../../railroad/sequence';
import { FakeSVG } from '../../railroad/fake_svg';
import { Options } from '../../railroad/options';
import * as tags from '../../railroad/tags';

describe('Railroad / Sequence', () => {
    
    describe('Constructor', () => {
        
        it('should set needsSpace to true', () => {
            const item = new FakeSVG('g');
            const sequence = new Sequence([item]);
            
            expect(sequence.needsSpace).toBe(true);
        });
        
        it('should calculate width correctly based on items', () => {
            const item1 = new FakeSVG('g');
            item1.width = 50;
            item1.needsSpace = true; // adds 20 to width
            
            const item2 = new FakeSVG('g');
            item2.width = 30;
            item2.needsSpace = false;
            
            const sequence = new Sequence([item1, item2]);
            
            // Should include items with space considerations
            // - the initial width calculation would be 50 + 20 + 30
            // - but first and last item's space gets subtracted if they need space
            expect(sequence.width).toBeGreaterThan(50 + 30);
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
            
            const sequence = new Sequence([item1, item2]);
            
            expect(sequence.height).toBe(100 + 50);
            expect(sequence.up).toBeLessThanOrEqual(0);
            expect(sequence.down).toBeGreaterThanOrEqual(0);
        });
        
        it('should add debug attributes when debug option is true', () => {
            const item = new FakeSVG('g');
            const options = new Options({ debug: true });
            const sequence = new Sequence([item], options);
            
            expect(sequence.attributes.get('data-updown')).toBeDefined();
            expect(sequence.attributes.get('data-type')).toBe('sequence');
        });
        
        it('should not add debug attributes when debug option is false', () => {
            const item = new FakeSVG('g');
            const options = new Options({ debug: false });
            const sequence = new Sequence([item], options);
            
            expect(sequence.attributes.get('data-updown')).toBeUndefined();
            expect(sequence.attributes.get('data-type')).toBeUndefined();
        });
        
        it('should accept another sequence as children', () => {
            const item = new Sequence([]);
            const options = new Options({ debug: false });
            const sequence = new Sequence([item], options);
            
            expect(sequence.items.length).toBe(1);
        });
        
    });
    
    describe('Method: format', () => {
        
        it('should calculate gaps using determineGaps function', () => {
            const item = new FakeSVG('g');
            const sequence = new Sequence([item]);
            
            const pathSpy = jest.spyOn(tags, 'path');
            
            sequence.format(0, 0, 100);
            
            expect(pathSpy).toHaveBeenCalled();
            
            pathSpy.mockRestore();
        });
        
        it('should add paths for items that need space', () => {
            const item1 = new FakeSVG('test');
            item1.needsSpace = true;
            item1.width = 50;
            item1.height = 30;
            item1.format = jest.fn().mockReturnValue(item1);
            
            const item2 = new FakeSVG('test');
            item2.needsSpace = true;
            item2.width = 30;
            item2.height = 20;
            item2.format = jest.fn().mockReturnValue(item2);
            
            const item3 = new FakeSVG('test');
            item3.needsSpace = false;
            item3.width = 20;
            item3.height = 15;
            item3.format = jest.fn().mockReturnValue(item3);
            
            const sequence = new Sequence([item1, item2, item3]);
            const addToSpy = jest.spyOn(FakeSVG.prototype, 'addTo');
            sequence.format();
            
            // Count the number of paths added
            const pathAdditions = addToSpy.mock.calls.filter(
                call => 
                    (call[0].children as FakeSVG[])
                        .some((child: any) => child.tag === 'path'
                )
            ).length;
            
            expect(pathAdditions).toBeGreaterThanOrEqual(6);
            
            addToSpy.mockRestore();
        });
        
        it('should format each item and add to sequence', () => {
            const item1 = new FakeSVG('g');
            item1.needsSpace = true;
            item1.width = 50;
            item1.height = 30;
            item1.format = jest.fn().mockReturnValue(item1);
            
            const item2 = new FakeSVG('g');
            item2.needsSpace = false;
            item2.width = 30;
            item2.height = 20;
            item2.format = jest.fn().mockReturnValue(item2);
            
            const sequence = new Sequence([item1, item2]);
            
            sequence.format();
            
            expect(item1.format).toHaveBeenCalled();
            expect(item2.format).toHaveBeenCalled();
        });
        
        it('should return the sequence itself after formatting', () => {
            const item = new FakeSVG('g');
            const sequence = new Sequence([item]);
            
            const result = sequence.format();
            
            expect(result).toBe(sequence);
        });
        
    });

});