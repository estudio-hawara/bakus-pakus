/* istanbul ignore file */

type alignment = 'left' | 'center' | 'right';

interface RailroadDiagramConfig {
    debug: boolean;
    verticalSeparation: number;
    arcRadius: number;
    diagramClass: string;
    strokeOddPixelLength: boolean;
    internalAlignment: alignment;
    defaultCharWidth: number;
    commentCharWidth: number;
}

export class Options
{
    // Write some debug information into attributes
    #debug: boolean;
    
    // Minimum vertical separation between things. For a 3px stroke, must be at least 4
    #verticalSeparation: number;
    
    // Radius of arcs
    #arcRadius: number;
    
    // Class to put on the root <svg>
    #diagramClass: string;
    
    // Is the stroke width an odd (1px, 3px, etc) pixel length?
    #strokeOddPixelLength: boolean;
    
    // How to align items when they have extra space
    #internalAlignment: alignment;
    
    // Default font size (character width)
    #defaultCharWidth: number;
    
    // Comment font size (character width)
    #commentCharWidth: number;
    
    constructor(
        options: Partial<RailroadDiagramConfig> = {}
    ) {
        this.#debug = options.debug ?? false;
        this.#verticalSeparation = options.verticalSeparation ?? 8;
        this.#arcRadius = options.arcRadius ?? 10;
        this.#diagramClass = options.diagramClass ?? 'railroad-diagram';
        this.#strokeOddPixelLength = options.strokeOddPixelLength ?? true;
        this.#internalAlignment = options.internalAlignment ?? 'center';
        this.#defaultCharWidth = options.defaultCharWidth ?? 8.5;
        this.#commentCharWidth = options.commentCharWidth ?? 7;
    }
    
    get debug()
    {
        return this.#debug;
    }
    
    get verticalSeparation()
    {
        return this.#verticalSeparation;
    }
    
    get arcRadius()
    {
        return this.#arcRadius;
    }
    
    get diagramClass()
    {
        return this.#diagramClass;
    }
    
    get strokeOddPixelLength()
    {
        return this.#strokeOddPixelLength;
    }
    
    get internalAlignment()
    {
        return this.#internalAlignment;
    }
    
    get defaultCharWidth()
    {
        return this.#defaultCharWidth;
    }
    
    get commentCharWidth()
    {
        return this.#commentCharWidth;
    }
};