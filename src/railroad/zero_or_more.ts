import { FakeSVG } from "@app/railroad/fake_svg";
import { OneOrMore } from "@app/railroad/one_or_more";
import { Optional } from "@app/railroad/optional";
import { Options } from "@app/railroad/options";
import { Skip } from "@app/railroad/skip";

export class ZeroOrMore extends Optional
{
    constructor(item: FakeSVG, separator: FakeSVG = new Skip, options: Options = new Options)
    {
        const oneOrMore = new OneOrMore(item, separator);
    
        super(oneOrMore, true, options);

        this.height = item.height;

        if (this.options.debug) {
            this.attributes.add('data-updown', `${this.up} ${this.height} ${this.down}`);
            this.attributes.add('data-type', 'zero-or-more');
        }
    }
}