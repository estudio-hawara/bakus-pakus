import { FakeSVG } from "./fake_svg";
import { Options } from "./options";
import { Path } from "./path";

export type EndType = 'simple' | 'complex';

export class End extends FakeSVG
{
    #type: EndType;

    constructor(
        type: EndType = 'simple',
        options: Options = new Options,
    ) {
        super('path', undefined, undefined, undefined, options);

        this.#type = type;

        if (this.options.debug) {
            this.attributes.add('data-updown', this.up + " " + this.down);
            this.attributes.add('data-type', 'end');
        }
    }

    get type(): EndType
    {
        return this.#type;
    }

    get width(): number
    {
        return 20;
    }

    get up(): number
    {
        return 10;
    }

    get down(): number
    {
        return 10;
    }

    format(x: number, y: number): End
    {
        if (this.type === "simple")
            this.attributes.concat('d', ` M ${x} ${y} h 20 m -10 -10 v 20 m 10 -20 v 20`);
        else
            this.attributes.concat('d', ` M ${x} ${y} h 20 m 0 -10 v 20`);

        return this;
    }
}