/* istanbul ignore file */

type alignment = 'left' | 'center' | 'right';

export class Options
{
    constructor(
        // Write some debug information into attributes
        public readonly debug: boolean = false,

        // Minimum vertical separation between things. For a 3px stroke, must be at least 4
        public readonly verticalSeparation: number = 8,

        // Radius of arcs
        public readonly arcRadius: number = 10,

        // Class to put on the root <svg>
        public readonly diagramClass: string = 'railroad-diagram',

        // Is the stroke width an odd (1px, 3px, etc) pixel length?
        public readonly strokeOddPixelLength: boolean = true,

        // How to align items when they have extra space
        public readonly internalAlignment: alignment = 'center',

        // Default font size (character width)
        public readonly defaultCharWidth: number = 8.5,

        // Comment font size (character width)
        public readonly commentCharWidth: number = 7,
    ) {}
};