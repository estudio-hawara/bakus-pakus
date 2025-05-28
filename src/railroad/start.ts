import { FakeSVG } from "@railroad/fake_svg";
import { Options } from "@railroad/options";
import { Path } from "@railroad/path";
import { text } from "@railroad/tags";

export type StartType = 'simple' | 'complex';

export class Start extends FakeSVG
{
    #type: StartType;
    #label: string;

    constructor(
        type: StartType = 'simple',
        label: string = '',
        options: Options = new Options,
    ) {
        super('g', undefined, undefined, undefined, options);

        this.#type = type;
        this.#label = label;

        this.up = this.down = 10;
        this.width = Math.max(20, this.label.length * this.options.defaultCharWidth + 10);

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

    format(x: number, y: number): Start
    {
        let path = new Path(x, y - 10);

        if (this.type === "simple") {
            path.vDown(20)
                .m(10, -20)
                .vDown(20)
                .m(-10, -10)
                .right(this.width)
                .addTo(this);
        } else {
            path.vDown(20)
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