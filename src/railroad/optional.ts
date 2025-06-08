import { Choice } from "@app/railroad/choice";
import { FakeSVG } from "@app/railroad/fake_svg";
import { Options } from "@app/railroad/options";
import { Skip } from "@app/railroad/skip";

export class Optional extends Choice
{
    constructor(item: FakeSVG, skip: boolean = false, options: Options = new Options)
    {
        const normal = skip ? 0 : 1;

        super([new Skip, item], normal, options);

        this.attributes.add('class', 'optional');

        if (this.options.debug) {
            this.attributes.add('data-updown', `${this.up} ${this.height} ${this.down}`);
            this.attributes.add('data-type', 'optional');
        }
    }
}