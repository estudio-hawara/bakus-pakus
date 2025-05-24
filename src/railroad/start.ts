import { Attributes } from "./attributes";
import { FakeSVG } from "./fake_svg";
import { Options } from "./options";
import { Path } from "./path";
import { text } from "./tags";

export type StartType = 'simple' | 'complex';

export class Start extends FakeSVG
{
    #type: StartType;
    #label: string;

    constructor(
        type: StartType,
        label: string = '',
        options: Options = new Options,
    ) {
        super('g', undefined, undefined, undefined, options);

        this.#type = type;
        this.#label = label;

        if (this.options.debug) {
            this.attributes.add('data-updown', this.up + " " + this.down);
            this.attributes.add('data-type', 'start');
        }
    }

    get type(): StartType
    {
        return this.#type;
    }

    get label(): string
    {
        return this.#label;
    }

    get width(): number
    {
        return Math.max(20, this.label.length * this.options.defaultCharWidth + 10);
    }

    get up(): number
    {
        return 10;
    }

    get down(): number
    {
        return 10;
    }

    format(x: number, y: number): Start
    {
        let path = new Path(x, y - 10);

        if (this.type === "simple") {
            path.down(20)
                .m(10, -20)
                .down(20)
                .m(-10, -10)
                .right(this.width)
                .addTo(this);
        } else {
            path.down(20)
                .m(0, -10)
                .right(this.width)
                .addTo(this);
        }

        if(this.label)
            text(this.label, {x: x, y: y - 15, style: 'text-anchor:start'})
                .addTo(this);

        return this;
    }
}