import { Attributes } from '../../railroad/attributes';
import { FakeSVG } from '../../railroad/fake_svg';
import { Options } from '../../railroad/options';

describe('Railroad / FakeSVG', () => {

    const mockDocument = {
        createElementNS: jest.fn(),
    } as unknown as Document;

    const mockElement = {
        setAttribute: jest.fn(),
        setAttributeNS: jest.fn(),
        appendChild: jest.fn(),
        textContent: '',
    } as unknown as Element;

    beforeEach(() => {
        jest.clearAllMocks();
        (mockDocument.createElementNS as jest.Mock).mockReturnValue(mockElement);
    });

    describe('Constructor', () => {

        it('creates a simple svg elements', () => {
            const svg = new FakeSVG('rect');
            expect(svg.toString()).toContain('<rect></rect>');
        });
        
        it('should create an instance with tag and attributes', () => {
            const attributes = new Attributes();
            attributes.add('width', '100');
            attributes.add('height', '50');
            
            const svg = new FakeSVG('rect', attributes);
            const result = svg.toString();
            
            expect(result).toContain('width="100"');
            expect(result).toContain('height="50"');
        });

        it('accepts attributes as a plain object', () => {
            const svg = new FakeSVG('rect', {
                width: 100,
                height: 50,
            });

            const result = svg.toString();
            
            expect(result).toContain('width="100"');
            expect(result).toContain('height="50"');
        });

    });

    describe('Getters: attributes', () => {

        it('shares its attributes', () => {
            const attributes = new Attributes();
            attributes.add('width', '100');
            attributes.add('height', '50');
            
            const svg = new FakeSVG('rect', attributes);
            
            expect(svg.attributes.get('width')).toBe('100');
            expect(svg.attributes.get('height')).toBe('50');
        });

    });

    describe('Getters: children', () => {

        it('returns it\'s text as children', () => {
            const fakeSvg = new FakeSVG('text', new Attributes(), 'Initial text');
            
            expect(fakeSvg.children).toContain('Initial text');
        });

    });

    describe('Getters: options', () => {

        it('shares the options that\'s using', () => {
            const options = new Options({
                debug: true,
                verticalSeparation: 10,
            });

            const svg = new FakeSVG('svg', undefined, undefined, undefined, options);

            expect(svg.options.debug).toBe(true);
            expect(svg.options.verticalSeparation).toBe(10);
        });

    });

    describe('Method: appendChild', () => {

        it('should add child element to empty children array', () => {
            const parent = new FakeSVG('g');
            const child = new FakeSVG('rect');

            parent.appendChild(child);

            const result = parent.toString();
            expect(result).toContain('<rect>');
        });

        it('should convert string children to array when adding child', () => {
            const parent = new FakeSVG('text', new Attributes(), 'Initial text');
            const child = new FakeSVG('tspan');
            
            parent.appendChild(child);
            
            const result = parent.toString();
            expect(result).toContain('<tspan>');
            expect(result).not.toContain('Initial text');
        });

        it('can add multiple children', () => {
            const parent = new FakeSVG('g');
            const child1 = new FakeSVG('rect');
            const child2 = new FakeSVG('circle');
            
            parent.appendChild(child1);
            parent.appendChild(child2);
            
            const result = parent.toString();
            expect(result).toContain('<rect>');
            expect(result).toContain('<circle>');
        });

    });

    describe('Method: addTo', () => {

        it('can add an element to another fake svg', () => {
            const parent = new FakeSVG('g');
            const child = new FakeSVG('rect');
            
            const result = child.addTo(parent);
            
            expect(result).toBeInstanceOf(FakeSVG);
            expect(parent.children.length).toBe(1);
        });

        it('can add an element to a dom parent', () => {
            const parent = document.createElement('div');
            const child = new FakeSVG('rect', new Attributes(), '', document);
            
            const result = child.addTo(parent);
            
            expect(result).toBeInstanceOf(Element);
            expect(parent.children.length).toBe(1);
        });

    });

    describe('Method: toSVG', () => {

        it('to svg should throw error when document is null', () => {
            const svg = new FakeSVG('rect');
            
            expect(() => svg.toSVG()).toThrow('Missing document object');
        });

        it('should create an svg element with attributes', () => {
            const attributes = new Attributes();
            attributes.add('width', '100');
            attributes.add('height', '50');
            
            const svg = new FakeSVG('rect', attributes, '', mockDocument);
            svg.toSVG();
            
            expect(mockDocument.createElementNS).toHaveBeenCalledWith('http://www.w3.org/2000/svg', 'rect');
            expect(mockElement.setAttribute).toHaveBeenCalledWith('width', '100');
            expect(mockElement.setAttribute).toHaveBeenCalledWith('height', '50');
        });

        it('includes it\'s children when rendered as an svg', () => {
            const g = new FakeSVG('g', new Attributes, '', mockDocument);
            const circle = new FakeSVG('circle');
            const rect = new FakeSVG('rect');

            g.appendChild(circle);
            g.appendChild(rect);
            const svg = g.toSVG();
            
            expect(svg.appendChild).toHaveBeenCalledTimes(2);
        });

    });

    describe('Method: toString', () => {

        it('should render an svg element with attributes', () => {
            const attributes = new Attributes();
            attributes.add('width', '100');
            attributes.add('height', '50');
            
            const svg = new FakeSVG('rect', attributes, '', mockDocument);
            const string = svg.toString();
            
            expect(string).toContain('<rect width="100" height="50"></rect>');
        });

    });

    describe('Method: walk', () => {

        it('executes a given callback', () => {
            const rect = new FakeSVG('rect');
            const callback = jest.fn();
            rect.walk(callback);

            expect(callback).toHaveBeenCalledTimes(1);
        });

    });

});