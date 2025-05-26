import { Attributes } from "./attributes";
import { FakeSVG } from "./fake_svg";
import { Options } from "./options";

type FourCardinals = 'North' | 'East' | 'South' | 'West';

type EightCardinals = FourCardinals | 'North East' | 'South East' | 'South West' | 'North West';

type Spin = 'Clockwise' | 'Counter clockwise';


function isValidCardinal(value: string): value is EightCardinals {
    const validCardinals: EightCardinals[] = [
        'North', 'East', 'South', 'West',
        'North East', 'South East', 'South West', 'North West'
    ];
    return validCardinals.includes(value as EightCardinals);
}

export class Path extends FakeSVG
{
    #x: number;
    #y: number;
    
    constructor(
        x: number,
        y: number,
        attributes: Attributes | { [key: string]: string | number | boolean } = new Attributes,
        document: Document | null = null,
        options: Options = new Options,
    ) {
        if (! (attributes instanceof Attributes))
            attributes = new Attributes(attributes);
        
        super('path', attributes, '', document, options);
        
        this.#x = x;
        this.#y = y;
        this.attributes.add('d', `M ${x} ${y}`);
    }
    
    get x(): number
    {
        return this.#x;
    }
    
    get y(): number
    {
        return this.#y;
    }
    
    static isClockwise(from: FourCardinals, to: FourCardinals)
    {
        return (from == 'North' && to == 'East') ||
        (from == 'East' && to == 'South') ||
        (from == 'South' && to == 'West') ||
        (from == 'West' && to == 'North');
    }
    
    m(x: number, y: number): Path
    {
        this.attributes.concat('d', ` m ${x} ${y}`);
        
        return this;
    }
    
    h(value: number): Path
    {
        this.attributes.concat('d', ` h ${value}`);
        
        return this;
    }
    
    right(value: number): Path
    {
        return this.h(Math.max(0, value));
    }
    
    left(value: number): Path
    {
        return this.h(-Math.max(0, value));
    }
    
    v(value: number): Path
    {
        this.attributes.concat('d', ` v ${value}`);
        
        return this;
    }
    
    vDown(value: number): Path
    {
        return this.v(Math.max(0, value));
    }
    
    vUp(value: number): Path
    {
        return this.v(-Math.max(0, value));
    }
    
    l(x: number, y: number): Path
    {
        this.attributes.concat('d', ` l ${x} ${y}`);
        
        return this;
    }
    
    format(): Path
    {
        this.attributes.concat('d', 'h.5');
        
        return this;
    }
    
    arc(from: FourCardinals, to: FourCardinals)
    {
        const arc = this.options.arcRadius;
        
        let x = arc;
        let y = arc;
        
        if (from == 'East' || to == 'West')
            x *= -1;
        
        if (from == 'South' || to == 'North')
            y *= -1;
        
        let clockwise: number = Path.isClockwise(from, to) ? 1 : 0;
        
        this.attributes.concat('d', ` a ${arc} ${arc} 0 0 ${clockwise} ${x} ${y}`);
        
        return this;
    }
    
    semiArc(from: EightCardinals, spin: Spin)
    {
        const arc = this.options.arcRadius;
        const section = arc * Math.sin(Math.PI / 4);
        const inversed = arc - section;
        
        let clockwise = spin == 'Clockwise' ? 1 : 0;
        let path = ` a ${arc} ${arc} 0 0 ${clockwise}`;
        
        if (! isValidCardinal(from))
            throw new Error('Invalid cardinal for a semi arc');
        
        if (! ['Clockwise', 'Counter clockwise'].includes(spin))
            throw new Error('Invalid spin for a semi arc');
        
        if (spin == 'Clockwise') {
            switch(from) {
                case('North'):
                    path += ` ${section} ${inversed}`;
                    break;
                case('North East'):
                    path += ` ${inversed} ${section}`;
                    break;
                case('East'):
                    path += ` -${inversed} ${section}`;
                    break;
                case('South East'):
                    path += ` -${section} ${inversed}`;
                    break;
                case('South'):
                    path += ` -${section} -${inversed}`;
                    break;
                case('South West'):
                    path += ` -${inversed} -${section}`;
                    break;
                case('West'):
                    path += ` ${inversed} -${section}`;
                    break;
                case('North West'):
                    path += ` ${section} -${inversed}`;
                    break;
            }
        }
        
        if (spin == 'Counter clockwise') {
            switch(from) {
                case('North'):
                    path += ` -${section} ${inversed}`;
                    break;
                case('North West'):
                    path += ` -${inversed} ${section}`;
                    break;
                case('West'):
                    path += ` ${inversed} ${section}`;
                    break;
                case('South West'):
                    path += ` ${section} ${inversed}`;
                    break;
                case('South'):
                    path += ` ${section} -${inversed}`;
                    break;
                case('South East'):
                    path += ` ${inversed} -${section}`;
                    break;
                case('East'):
                    path += ` -${inversed} -${section}`;
                    break;
                case('North East'):
                    path += ` -${section} -${inversed}`;
                    break;
            }
        }
        
        this.attributes.concat('d', path);
        
        return this;
    }
}