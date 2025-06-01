import { FakeSVG } from "@app/railroad/fake_svg";
import { path } from "@app/railroad/tags";

export class Skip extends FakeSVG
{
    constructor()
    {
        super('g');

		if(this.options.debug)
			this.attributes.add('data-type', 'skip');
    }

    format(x: number, y: number, width: number): Skip
    {
        path(x, y)
            .right(width)
            .addTo(this);
        
        return this;
    }
}