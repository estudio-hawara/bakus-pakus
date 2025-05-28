import { DiagramContainer } from "@railroad/diagram_container";
import { FakeSVG } from "@railroad/fake_svg";
import { Options } from "@railroad/options";
import { path } from "@railroad/tags";
import { determineGaps } from "@railroad/utils";

export class Stack extends DiagramContainer
{
    constructor(items: FakeSVG[], options: Options = new Options)
    {
        if (! items.length)
            throw new RangeError('A stack needs at least one item');

        super('g', {}, items, options);

        if (this.items.length > 1)
            this.width += this.options.arcRadius;

        this.needsSpace = true;

        this.up = this.items[0].up;
        this.down = this.items[this.items.length - 1].down;

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];

            this.height += item.height;
            
            if (i > 0)
                this.height += Math.max(this.options.arcRadius * 2, item.up + this.options.verticalSeparation);

            if (i < this.items.length - 1)
                this.height += Math.max(this.options.arcRadius * 2, item.down + this.options.verticalSeparation);
        }

        if (this.options.debug) {
            this.attributes.add('data-updown', `${this.up} ${this.down}`);
            this.attributes.add('data-type', 'stack');
        }
    }

    format(
        x: number = 0,
        y: number = 0,
        width: number = 0,
    ): FakeSVG
    {
        const gaps = determineGaps(width, this.width, this.options);

        path(x, y)
            .h(gaps.left)
            .addTo(this);
        
        x += gaps.left;
        const start = x;

        if (this.items.length > 1) {
            path(x, y)
                .h(this.options.arcRadius)
                .addTo(this);
            
            x += this.options.arcRadius;
        }

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];

            const innerWidth = this.width - (this.items.length > 1 ? this.options.arcRadius * 2 : 0);

            item.format(x, y, innerWidth)
                .addTo(this);
            
            x += innerWidth;
            y += item.height;

            if (i !== this.items.length - 1) {
                path(x, y)
                    .arc('North', 'East')
                    .vDown(Math.max(0, item.down + this.options.verticalSeparation - this.options.arcRadius * 2))
                    .arc('East', 'South')
                    .left(innerWidth)
                    .arc('North', 'West')
                    .vDown(Math.max(0, this.items[i + 1].up + this.options.verticalSeparation - this.options.arcRadius * 2))
                    .arc('West', 'South')
                    .addTo(this);
                
                y += Math.max(item.down + this.options.verticalSeparation, this.options.arcRadius * 2);
                x = start + this.options.arcRadius;
            }
        }

        if (this.items.length > 1) {
            path(x, y)
                .h(this.options.arcRadius)
                .addTo(this);
            
            x += this.options.arcRadius;
        }

        path(x, y)
            .h(gaps.right)
            .addTo(this);

        return this;
    }
}