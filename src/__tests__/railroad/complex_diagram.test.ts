import { ComplexDiagram } from '../../railroad/complex_diagram';
import { Start } from '../../railroad/start';
import { End } from '../../railroad/end';
import { FakeSVG } from '../../railroad/fake_svg';
import { Options } from '../../railroad/options';

describe('Railroad / ComplexDiagram', () => {
    
    describe('Constructor', () => {
        
        it('should add complex start and end nodes if not provided', () => {
            const item = new FakeSVG('g');
            const diagram = new ComplexDiagram([item]);

            const start = (diagram.items[0] as Start);
            const end = (diagram.items[diagram.items.length - 1] as End);
            
            expect(start).toBeInstanceOf(Start);
            expect(start.type).toBe('complex');
            expect(end).toBeInstanceOf(End);
            expect(end.type).toBe('complex');
            expect(diagram.items.length).toBe(3);
        });
        
        it('should not add start node if already present', () => {
            const start = new Start('complex');
            const item = new FakeSVG('g');
            const diagram = new ComplexDiagram([start, item]);

            expect(diagram.items[0]).toBe(start);
            expect(diagram.items[diagram.items.length - 1]).toBeInstanceOf(End);
            expect(diagram.items.length).toBe(3);
        });

        it('should not add end node if already present', () => {
            const item = new FakeSVG('g');
            const end = new End('complex');
            const diagram = new ComplexDiagram([item, end]);

            const start = (diagram.items[0] as Start);

            expect(start).toBeInstanceOf(Start);
            expect(start.type).toBe('complex');
            expect(diagram.items[diagram.items.length - 1]).toBe(end);
            expect(diagram.items.length).toBe(3);
        });

        it('should not add start or end nodes if both already present', () => {
            const start = new Start('complex');
            const item = new FakeSVG('g');
            const end = new End('complex');
            const diagram = new ComplexDiagram([start, item, end]);
            
            expect(diagram.items[0]).toBe(start);
            expect(diagram.items[diagram.items.length - 1]).toBe(end);
            expect(diagram.items.length).toBe(3);
        });

        it('should replace regular start node with complex start node', () => {
            const start = new Start();
            const item = new FakeSVG('g');
            const diagram = new ComplexDiagram([start, item]);
            
            expect(diagram.items[0]).not.toBe(start);
            expect(diagram.items[0]).toBeInstanceOf(Start);
            expect((diagram.items[0] as Start).type).toBe('complex');
            expect(diagram.items.length).toBe(3);
        });

        it('should replace regular End node with complex End node', () => {
            const item = new FakeSVG('g');
            const end = new End();
            const diagram = new ComplexDiagram([item, end]);
            
            expect(diagram.items[diagram.items.length - 1]).not.toBe(end);
            expect(diagram.items[diagram.items.length - 1]).toBeInstanceOf(End);
            expect((diagram.items[diagram.items.length - 1] as End).type).toBe('complex');
            expect(diagram.items.length).toBe(3);
        });
        
        it('should pass options to parent constructor', () => {
            const item = new FakeSVG('g');
            const options = new Options({ strokeOddPixelLength: true });
            const diagram = new ComplexDiagram([item], options);
            
            expect(diagram.options).toBe(options);
        });

    });
    
});