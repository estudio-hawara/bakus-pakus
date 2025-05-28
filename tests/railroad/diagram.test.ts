import { Diagram, PaddingType } from '@railroad/diagram';
import { Start } from '@railroad/start';
import { End } from '@railroad/end';
import { FakeSVG } from '@railroad/fake_svg';
import { Options } from '@railroad/options';
import { Path } from '@railroad/path';
import { DiagramContainer } from '@railroad/diagram_container';
import { defaultStyle } from '@railroad/style';

describe('Railroad / Diagram', () => {
    
    describe('Constructor', () => {
        
        it('should add start and end nodes if not provided', () => {
            const item = new FakeSVG('g');
            const diagram = new Diagram([item]);
            
            expect(diagram.items[0]).toBeInstanceOf(Start);
            expect(diagram.items[diagram.items.length - 1]).toBeInstanceOf(End);
            expect(diagram.items.length).toBe(3);
        });
        
        it('should not add start node if already present', () => {
            const start = new Start();
            const item = new FakeSVG('g');
            const diagram = new Diagram([start, item]);
            
            expect(diagram.items[0]).toBe(start);
            expect(diagram.items.length).toBe(3);
        });
        
        it('should not add end node if already present', () => {
            const item = new FakeSVG('g');
            const end = new End();
            const diagram = new Diagram([item, end]);
            
            expect(diagram.items[0]).toBeInstanceOf(Start);
            expect(diagram.items[diagram.items.length - 1]).toBe(end);
            expect(diagram.items.length).toBe(3);
        });
        
        it('should not add start or end nodes if both already present', () => {
            const start = new Start();
            const item = new FakeSVG('g');
            const end = new End();
            const diagram = new Diagram([start, item, end]);
            
            expect(diagram.items[0]).toBe(start);
            expect(diagram.items[diagram.items.length - 1]).toBe(end);
            expect(diagram.items.length).toBe(3);
        });
        
        it('should calculate width correctly based on items', () => {
            const item1 = new FakeSVG('g');
            item1.width = 50;
            item1.needsSpace = true; // adds 20 to width
            
            const item2 = new FakeSVG('g');
            item2.width = 30;
            item2.needsSpace = false;
            
            const diagram = new Diagram([item1, item2]);
            
            // Should include Start and End nodes plus the items
            // Start and End should each have default widths and potentially needsSpace values
            expect(diagram.width).toBeGreaterThan(50 + 20 + 30); // At minimum these values plus Start/End widths
        });
        
        it('should calculate height, up, and down properties correctly', () => {
            const item = new FakeSVG('g');
            item.height = 100;
            item.up = 20;
            item.down = 30;
            
            const diagram = new Diagram([item]);
            
            expect(diagram.height).toBeGreaterThanOrEqual(100); // Should include at least the item height
            expect(diagram.up).toBeGreaterThanOrEqual(0); // Should be calculated based on item.up - height
            expect(diagram.down).toBeGreaterThanOrEqual(0); // Should be calculated based on item.down
        });
        
    });
    
    describe('Method: format', () => {
        
        it('should return the same object if already formatted', () => {
            const item = new FakeSVG('g');
            const diagram = new Diagram([item]);
            
            const firstResult = diagram.format();
            const secondResult = diagram.format();
            
            expect(secondResult).toBe(firstResult);
        });
        
        it('should throw an error if width is provided', () => {
            const item = new FakeSVG('g');
            const diagram = new Diagram([item]);
            
            expect(() => diagram.format(0, 0, 100)).toThrow(Error);
        });
        
        it('should apply default padding values correctly', () => {
            const item = new FakeSVG('test');
            const diagram = new Diagram([item]);
            
            diagram.format();
            
            const defaultPadding: PaddingType = { top: 20, right: 20, bottom: 20, left: 20 };
            const width = Number(diagram.attributes.get('width'));
            
            expect(width).toBe(diagram.width + defaultPadding.left! + defaultPadding.right!);
        });
        
        it('should respect custom padding values', () => {
            const item = new FakeSVG('g');
            const diagram = new Diagram([item]);
            
            const customPadding: PaddingType = { top: 10, right: 15, bottom: 20, left: 25 };
            diagram.format(0, 0, 0, customPadding);
            
            const width = Number(diagram.attributes.get('width'));
            const height = Number(diagram.attributes.get('height'));
            
            expect(width).toBe(diagram.width + customPadding.left! + customPadding.right!);
            expect(height).toBe(diagram.up + diagram.height + diagram.down + customPadding.top! + customPadding.bottom!);
        });
        
        it('should set viewBox attribute correctly', () => {
            const item = new FakeSVG('test');
            const diagram = new Diagram([item]);
            
            diagram.format();
            
            const width = diagram.attributes.get('width');
            const height = diagram.attributes.get('height');
            
            expect(diagram.attributes.get('viewBox')).toBe(`0 0 ${width} ${height}`);
        });
        
        it('should add transform attribute when strokeOddPixelLength is true', () => {
            const item = new FakeSVG('test');
            const options = new Options({ strokeOddPixelLength: true });
            const diagram = new Diagram([item], options);
            
            diagram.format();
            
            const children = diagram.children;
            
            expect(Array.isArray(children)).toBeTruthy();
            
            const g = (children as FakeSVG[]).find(child => child instanceof FakeSVG && child.tag === 'g');
            
            expect(g).toBeDefined();
            
            if (g instanceof FakeSVG) {
                expect(g.attributes.get('transform')).toBe('translate(.5 .5)');
            }
        });
        
        it('should format each item and add paths for items that need space', () => {
            const item1 = new FakeSVG('g');
            item1.needsSpace = true;
            item1.width = 50;
            item1.format = jest.fn().mockReturnValue(item1);
            
            const item2 = new FakeSVG('g');
            item2.needsSpace = false;
            item2.width = 30;
            item2.format = jest.fn().mockReturnValue(item2);
            
            const start = new Start();
            start.format = jest.fn().mockReturnValue(start);
            
            const end = new End();
            end.format = jest.fn().mockReturnValue(end);
            
            const diagram = new Diagram([start, item1, item2, end]);
            
            // Use mockImplementation to track the paths created
            const mockPathAddTo = jest.fn();
            const pathAddToOriginal = Path.prototype.addTo;
            const pathHOriginal = Path.prototype.h;
            
            // Mock both Path.prototype.addTo and Path.prototype.h
            Path.prototype.addTo = function() {
                mockPathAddTo(this);
                return this;
            };
            
            Path.prototype.h = function() {
                return this;
            };
            
            diagram.format();
            
            // Verify format was called on all items
            expect(item1.format).toHaveBeenCalled();
            expect(item2.format).toHaveBeenCalled();
            
            // For items that needsSpace, we should have paths before and after
            // - item1 needs space, so we should have 2 paths for it
            // - item2 doesn't need space, so no paths specifically for it
            const pathCalls = mockPathAddTo.mock.calls.length;
            expect(pathCalls).toBeGreaterThanOrEqual(2); // At least 2 for item1
            
            // Restore the original methods
            Path.prototype.addTo = pathAddToOriginal;
            Path.prototype.h = pathHOriginal;
        });
        
        it('should mark diagram as formatted and add g element to children', () => {
            const item = new FakeSVG('g');
            const diagram = new Diagram([item]);
            
            diagram.format();
            
            // Check that at least one child is a g element
            const children = diagram.children;
            
            expect(Array.isArray(children)).toBe(true);
            
            const hasGElement = (children as FakeSVG[]).some(
                child => 
                    child instanceof FakeSVG && child.tag === 'g'
            );
            
            expect(hasGElement).toBe(true);
            
            // Format again and verify it returns the same object (indicating it's formatted)
            const result = diagram.format();
            expect(result).toBe(diagram);
        });
        
    });
    
    describe('Method: toSVG', () => {
        
        it('should pass document parameter to parent toSVG method when provided', () => {
            const item = new FakeSVG('test');
            const diagram = new Diagram([item]);
            
            const mockElement = {
                setAttributeNS: jest.fn().mockReturnValue({}),
                setAttribute: jest.fn().mockReturnValue({}),
                appendChild: jest.fn().mockReturnValue({}),
            } as unknown as Element;
            
            const mockDocument = {
                createElementNS: jest.fn().mockReturnValue(mockElement),
            } as unknown as Document;
            
            const formatSpy = jest.spyOn(diagram, 'format');
            const superToSVGSpy = jest.spyOn(DiagramContainer.prototype, 'toSVG');
            
            diagram.toSVG(mockDocument);
            
            expect(formatSpy).toHaveBeenCalled();
            expect(superToSVGSpy).toHaveBeenCalledWith(mockDocument);
            
            formatSpy.mockRestore();
            superToSVGSpy.mockRestore();
        });
        
    });
    
    describe('Method: toString', () => {
        
        it('should format the diagram and call parent toString method', () => {
            const item = new FakeSVG('test');
            const diagram = new Diagram([item]);
            
            const formatSpy = jest.spyOn(diagram, 'format');
            const superToStringSpy = jest.spyOn(DiagramContainer.prototype, 'toString');
            
            diagram.toString();
            
            expect(formatSpy).toHaveBeenCalled();
            expect(superToStringSpy).toHaveBeenCalled();
            
            formatSpy.mockRestore();
            superToStringSpy.mockRestore();
        });
        
    });
    
    describe('Method: toStandalone', () => {

        it('should format the diagram and add SVG namespace attributes', () => {
            const item = new FakeSVG('test');
            const diagram = new Diagram([item]);
            
            const formatSpy = jest.spyOn(diagram, 'format');
            const superToStringSpy = jest.spyOn(DiagramContainer.prototype, 'toString');
            
            diagram.toStandalone();
            
            expect(formatSpy).toHaveBeenCalled();
            expect(superToStringSpy).toHaveBeenCalled();
            
            formatSpy.mockRestore();
            superToStringSpy.mockRestore();
        });
        
        it('should add style element with default style when no style provided', () => {
            const item = new FakeSVG('test');
            const diagram = new Diagram([item]);
            
            diagram.format();
            
            const childrenPushSpy = jest.spyOn(diagram.children as FakeSVG[], 'push');
            
            diagram.toStandalone();
            
            expect(childrenPushSpy).toHaveBeenCalledWith(expect.any(FakeSVG));
            
            const styleElement = childrenPushSpy.mock.calls[0][0];
            expect(styleElement).toBeInstanceOf(FakeSVG);
            expect(styleElement.tag).toBe('style');
            expect(styleElement.children).toBe(defaultStyle);
            
            childrenPushSpy.mockRestore();
        });
        
        it('should add style element with custom style when provided', () => {
            const item = new FakeSVG('test');
            const diagram = new Diagram([item]);
            const customStyle = '.custom-style { color: red; }';
            
            diagram.format();
            
            const childrenPushSpy = jest.spyOn(diagram.children as FakeSVG[], 'push');
            
            diagram.toStandalone(customStyle);
            
            expect(childrenPushSpy).toHaveBeenCalledWith(expect.any(FakeSVG));
            
            const styleElement = childrenPushSpy.mock.calls[0][0];
            expect(styleElement).toBeInstanceOf(FakeSVG);
            expect(styleElement.tag).toBe('style');
            expect(styleElement.children).toBe(customStyle);
            
            childrenPushSpy.mockRestore();
        });
        
        it('should throw error if children is not an array', () => {
            const diagram = new Diagram([]);
            
            Object.defineProperty(diagram, 'children', {
                get: jest.fn().mockReturnValue('not an array')
            });
            
            expect(() => diagram.toStandalone()).toThrow(
                "Can't call standalone on an element with children of type string"
            );
        });
        
        it('should add and remove namespace attributes', () => {
            const item = new FakeSVG('test');
            const diagram = new Diagram([item]);
            
            diagram.format();
            
            const attributesAddSpy = jest.spyOn(diagram.attributes, 'add');
            const attributesDeleteSpy = jest.spyOn(diagram.attributes, 'delete');
            
            diagram.toStandalone();
            
            expect(attributesAddSpy).toHaveBeenCalledWith('xmlns', 'http://www.w3.org/2000/svg');
            expect(attributesAddSpy).toHaveBeenCalledWith('xmlns:xlink', 'http://www.w3.org/1999/xlink');
            
            expect(attributesDeleteSpy).toHaveBeenCalledWith('xmlns');
            expect(attributesDeleteSpy).toHaveBeenCalledWith('xmlns:xlink');
            
            attributesAddSpy.mockRestore();
            attributesDeleteSpy.mockRestore();
        });

    });
    
});