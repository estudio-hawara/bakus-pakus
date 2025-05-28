import { wrapString } from "@app/railroad/terminal";
import { DiagramContainer } from "@railroad/diagram_container";
import { FakeSVG } from "@railroad/fake_svg";
import { Options } from "@railroad/options";
import { path } from "@railroad/tags";
import { determineGaps } from "@railroad/utils";

export class VerticalSequence extends DiagramContainer
{
    constructor(items: FakeSVG[], options: Options = new Options)
    {
        if (! items.length)
            throw new RangeError('A vertical sequence requires at least one item');

        items = items.map(wrapString);

        super('g', {}, items, options);

        this.needsSpace = true;

        this.width = Math.max(...this.items.map(e => e.width + (e.needsSpace ? 20 : 0)));

        if (this.items.length > 1)
            this.width += this.options.arcRadius * 2;

        this.up = this.items[0].up;
        this.down = this.items[this.items.length - 1].down;

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];

            if (i !== this.items.length - 1)
                this.height += this.items[i].height + this.items[i].down + this.items[i + 1].up + this.options.verticalSeparation * 2;
        }

        if (this.options.debug) {
            this.attributes.add('data-updown', `${this.up} ${this.down}`);
            this.attributes.add('data-type', 'vertical-sequence');
        }
    }

    format(
        x: number = 0,
        y: number = 0,
        width: number = 0,
    ): FakeSVG
    {
        const gaps = determineGaps(width, this.width);

        path(x, y)
            .h(gaps.left)
            .addTo(this);

        const start = x;
		let minWidth = 1000;
        for (let i = 0; i < this.items.length; i++) {
			const item = this.items[i];

			minWidth = item.width < minWidth ? item.width : minWidth;
		}

		for (let i = 0; i < this.items.length; i++) {
			const item = this.items[i];

			item.format(x, y, item.width)
                .addTo(this);
            
			y += item.height;

			if(i !== this.items.length - 1) {
				x += minWidth / 2;
				y += item.down

				path(x, y)
					.v(this.options.verticalSeparation * 2)
                    .addTo(this);
                
				y += this.items[i + 1].up + this.options.verticalSeparation * 2;
				x = start;
			} else {
				x += item.width;
				y += item.height;
			}
		}

		if (this.items.length > 1) {
			path(x, y)
                .h(this.width - this.items[this.items.length - 1].width)
                .addTo(this);
            
			x += this.options.arcRadius;
		}

		path(x,y)
            .h(gaps.right)
            .addTo(this);
        
        return this;
    }
}