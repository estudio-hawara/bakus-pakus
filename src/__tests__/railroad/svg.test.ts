import { SVG } from '../../railroad/svg';

describe('Railroad / SVG', () => {

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
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    test('should create SVG element with correct namespace', () => {
        SVG(mockDocument, 'rect');
        
        expect(mockDocument.createElementNS).toHaveBeenCalledWith(
            'http://www.w3.org/2000/svg',
            'rect'
        );
    });
    
    test('should create element with specified name', () => {
        SVG(mockDocument, 'circle');
        expect(mockDocument.createElementNS).toHaveBeenCalledWith(
            'http://www.w3.org/2000/svg',
            'circle'
        );
        
        SVG(mockDocument, 'path');
        expect(mockDocument.createElementNS).toHaveBeenCalledWith(
            'http://www.w3.org/2000/svg',
            'path'
        );
    });
    
    test('should set regular attributes using setAttribute', () => {
        const attributes: { [key: string]: string } = {
            'width': '100',
            'height': '200',
            'fill': 'red'
        };
        
        SVG(mockDocument, 'rect', attributes);
        
        expect(mockElement.setAttribute).toHaveBeenCalledWith('width', '100');
        expect(mockElement.setAttribute).toHaveBeenCalledWith('height', '200');
        expect(mockElement.setAttribute).toHaveBeenCalledWith('fill', 'red');
        expect(mockElement.setAttribute).toHaveBeenCalledTimes(3);
    });
    
    test('should handle xlink:href attribute specially using setAttributeNS', () => {
        const attributes: { [key: string]: string } = {
            'xlink:href': '#someId',
            'width': '50'
        };
        
        SVG(mockDocument, 'use', attributes);
        
        expect(mockElement.setAttributeNS).toHaveBeenCalledWith(
            'http://www.w3.org/1999/xlink',
            'href',
            '#someId'
        );
        expect(mockElement.setAttribute).toHaveBeenCalledWith('width', '50');
        expect(mockElement.setAttributeNS).toHaveBeenCalledTimes(1);
        expect(mockElement.setAttribute).toHaveBeenCalledTimes(1);
    });
    
    test('should set text content when provided', () => {
        const text: string = 'Hello SVG';
        SVG(mockDocument, 'text', {}, text);
        
        expect(mockElement.textContent).toBe(text);
    });
    
    test('should set empty text content when no text provided', () => {
        SVG(mockDocument, 'rect');
        expect(mockElement.textContent).toBe('');
    });
    
    test('should handle empty attributes object', () => {
        SVG(mockDocument, 'circle', {});
        
        expect(mockElement.setAttribute).not.toHaveBeenCalled();
        expect(mockElement.setAttributeNS).not.toHaveBeenCalled();
    });
    
    test('should handle undefined attributes (default parameter)', () => {
        SVG(mockDocument, 'ellipse');
        
        expect(mockElement.setAttribute).not.toHaveBeenCalled();
        expect(mockElement.setAttributeNS).not.toHaveBeenCalled();
    });
    
    test('should return the created element', () => {
        const result = SVG(mockDocument, 'polygon');
        expect(result).toBe(mockElement);
    });
    
    test('should handle mixed attributes including xlink:href', () => {
        const attributes: { [key: string]: string } = {
            'id': 'myElement',
            'xlink:href': '#target',
            'class': 'svg-element',
            'data-test': 'value'
        };
        
        SVG(mockDocument, 'use', attributes);
        
        expect(mockElement.setAttribute).toHaveBeenCalledWith('id', 'myElement');
        expect(mockElement.setAttribute).toHaveBeenCalledWith('class', 'svg-element');
        expect(mockElement.setAttribute).toHaveBeenCalledWith('data-test', 'value');
        expect(mockElement.setAttributeNS).toHaveBeenCalledWith(
            'http://www.w3.org/1999/xlink',
            'href',
            '#target'
        );
        expect(mockElement.setAttribute).toHaveBeenCalledTimes(3);
        expect(mockElement.setAttributeNS).toHaveBeenCalledTimes(1);
    });
    
    test('should handle numeric attribute values as strings', () => {
        const attributes: { [key: string]: string } = {
            'x': '10',
            'y': '20',
            'radius': '5'
        };
        
        SVG(mockDocument, 'circle', attributes, 'Test Text');
        
        expect(mockElement.setAttribute).toHaveBeenCalledWith('x', '10');
        expect(mockElement.setAttribute).toHaveBeenCalledWith('y', '20');
        expect(mockElement.setAttribute).toHaveBeenCalledWith('radius', '5');
        expect(mockElement.textContent).toBe('Test Text');
    });
    
    test('should handle multiple xlink:href attributes if present', () => {
        const attributes: { [key: string]: string } = {
            'xlink:href': '#first'
        };
        
        SVG(mockDocument, 'use', attributes);
        
        expect(mockElement.setAttributeNS).toHaveBeenCalledWith(
            'http://www.w3.org/1999/xlink',
            'href',
            '#first'
        );
    });

});
