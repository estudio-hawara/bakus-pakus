import { Group } from '@railroad/group';
import { FakeSVG } from '@railroad/fake_svg';
import { Options } from '@railroad/options';
import { Comment } from '@railroad/comment';
import * as tags from '@railroad/tags';
import * as utils from '@railroad/utils';

describe('Railroad / Group', () => {
    
    describe('Constructor', () => {

        it('should initialize with an item and label', () => {
            const item = new FakeSVG('g');
            const label = 'Test Label';
            const group = new Group(item, label);

            expect(group).toBeInstanceOf(Group);
            expect(group.tag).toBe('g');
            expect(group.needsSpace).toBe(true);
        });

        it('should calculate width based on items, label and arc radius', () => {
            const item = new FakeSVG('g');
            item.width = 50;
            item.needsSpace = true; // adds 20 to width
            
            const label = 'Test Label';
            const options = new Options({ arcRadius: 10, defaultCharWidth: 8 });
            const group = new Group(item, label, options);
            
            // Width should be the max of:
            // - item width (50) + spacing (20)
            // - label width (10 chars * 8 pixels + 10)
            // - 2 * arcRadius (20)
            const labelWidth = label.length * options.defaultCharWidth + 10;
            expect(group.width).toBe(Math.max(70, labelWidth, 20));
        });

        it('should calculate height and vertical metrics', () => {
            const item = new FakeSVG('g');
            item.height = 100;
            item.up = 20;
            item.down = 30;
            
            const options = new Options({ 
                arcRadius: 10,
                verticalSeparation: 8 
            });
            
            const group = new Group(item, 'Label', options);
            
            // Height should be the item's height
            expect(group.height).toBe(100);
            
            // Up should be max of (item.up + verticalSeparation) and arcRadius
            // Plus label height if there is a label
            expect(group.up).toBeGreaterThanOrEqual(Math.max(28, 10));
            
            // Down should be max of (item.down + verticalSeparation) and arcRadius
            expect(group.down).toBe(Math.max(38, 10));
        });

        it('should add debug attributes when debug mode is on', () => {
            const item = new FakeSVG('g');
            const options = new Options({ debug: true });
            const group = new Group(item, 'Debug Group', options);

            expect(group.attributes.get('data-updown')).toBeDefined();
            expect(group.attributes.get('data-type')).toBe('group');
        });

    });

    describe('Method: format', () => {

        it('should calculate gaps using determineGaps function', () => {
            const item = new FakeSVG('g');
            const group = new Group(item, 'Test');
            
            const determineGapsSpy = jest.spyOn(utils, 'determineGaps');
            
            group.format(0, 0, 100);
            
            expect(determineGapsSpy).toHaveBeenCalledWith(100, group.width);
            
            determineGapsSpy.mockRestore();
        });

        it('should create paths and rect elements with correct attributes', () => {
            const item = new FakeSVG('g');
            item.width = 50;
            item.height = 30;
            
            const options = new Options({ arcRadius: 10 });
            const group = new Group(item, 'Test', options);
            
            const pathSpy = jest.spyOn(tags, 'path');
            const rectSpy = jest.spyOn(tags, 'rect');
            
            group.format();
            
            expect(pathSpy).toHaveBeenCalled();
            expect(rectSpy).toHaveBeenCalledWith(expect.objectContaining({
                rx: options.arcRadius,
                ry: options.arcRadius,
                class: 'group-box'
            }));
            
            pathSpy.mockRestore();
            rectSpy.mockRestore();
        });

        it('should format item and add to group', () => {
            const item = new FakeSVG('g');
            item.width = 50;
            item.height = 30;
            item.format = jest.fn().mockReturnValue(item);
            
            const group = new Group(item, 'Test');
            const addToSpy = jest.spyOn(FakeSVG.prototype, 'addTo');
            
            group.format();
            
            expect(item.format).toHaveBeenCalled();
            expect(addToSpy).toHaveBeenCalled();
            
            addToSpy.mockRestore();
        });

        it('should format and position label when present', () => {
            const item = new FakeSVG('g');
            item.height = 30;
            item.format = jest.fn().mockReturnValue(item);
            
            const labelText = 'Test Label';
            const group = new Group(item, labelText);
            
            const addToSpy = jest.spyOn(FakeSVG.prototype, 'addTo');
            
            group.format();
            
            // Filter calls to find label formatting
            const labelFormatCalls = addToSpy.mock.calls.filter(call => 
                call[0] instanceof Comment
            );
            
            expect(labelFormatCalls.length).toBeGreaterThan(0);
            
            addToSpy.mockRestore();
        });

        it('should return the group itself after formatting', () => {
            const item = new FakeSVG('g');
            const group = new Group(item, 'Test');
            
            const result = group.format();
            
            expect(result).toBe(group);
        });

    });

    describe('Method: walk', () => {

        it('should call callback for itself, the item, and label if present', () => {
            const item = new FakeSVG('g');
            const group = new Group(item, 'Test Label');
            
            const callback = jest.fn();
            group.walk(callback);
            
            // Should be called for group itself, item, and label (3 times)
            expect(callback).toHaveBeenCalledTimes(3);
            expect(callback).toHaveBeenCalledWith(group);
            expect(callback).toHaveBeenCalledWith(item);
            expect(callback).toHaveBeenCalledWith(expect.any(Comment));
        });

        it('should call callback for itself and item only when no label', () => {
            const item = new FakeSVG('g');
            const group = new Group(item, ''); // Empty label
            
            const callback = jest.fn();
            group.walk(callback);
            
            // Should be called for group itself and item only (2 times)
            expect(callback).toHaveBeenCalledTimes(2);
            expect(callback).toHaveBeenCalledWith(group);
            expect(callback).toHaveBeenCalledWith(item);
        });

    });

});
