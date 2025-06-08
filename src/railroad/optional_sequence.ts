import { DiagramContainer } from "@railroad/diagram_container";
import { FakeSVG } from "@railroad/fake_svg";
import { Options } from "@railroad/options";
import { path } from "@railroad/tags";
import { determineGaps } from "@railroad/utils";

export class OptionalSequence extends DiagramContainer
{
    constructor(items: FakeSVG[], options: Options = new Options)
    {
        if (items.length <= 1)
            throw new RangeError('An optional sequence requires at least two items');

        super('g', {class: 'optional-sequence'}, items, options);

        this.height = this.items.map(e => e.height)
            .reduce((previous, current) => previous + current, 0);
        
        this.down = this.items[0].down;

        let heighSoFar = 0;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];

            heighSoFar += item.height;

            this.up = Math.max(
                this.up,
                2 * this.options.arcRadius - heighSoFar,
                item.up + this.options.verticalSeparation - heighSoFar,
            );

            if (i > 0)
                this.down = Math.max(
                    this.height + this.down,
                    2 * this.options.arcRadius - this.height,
                    item.down + this.options.verticalSeparation - this.height,
                );
            
            const itemWidth = (item.needsSpace ? 10 : 0) + item.width;

            this.width += Math.max(itemWidth, this.options.arcRadius);
            
            if (i === 0)
                this.width += this.options.arcRadius;
            else
                this.width += 3 * this.options.arcRadius;
        }

        if (this.options.debug) {
            this.attributes.add('data-updown', `${this.up} ${this.down}`);
            this.attributes.add('data-type', 'optional-sequence');
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
            .right(gaps.left)
            .addTo(this);
        
        path(x + gaps.left + this.width, y + this.height)
            .right(gaps.right)
            .addTo(this);
        
        x += gaps.left;
        
        const top = y - this.up;

        for(let i = 0; i < this.items.length; i++) {
            const item = this.items[i];

            const space = item.needsSpace ? 10 : 0;
            const width = item.width + space;

            if (i === 0) {
                path(x, y)
                    .arc('South', 'East')
                    .vUp(y - top - 2 * this.options.arcRadius)
                    .arc('West', 'North')
                    .right(width - this.options.arcRadius)
                    .arc('North', 'East')
                    .vDown(y + item.height - top - 2 * this.options.arcRadius)
                    .arc('West', 'South')
                    .addTo(this);
                
                path(x, y)
                    .right(space + this.options.arcRadius)
                    .addTo(this);
                
                item.format(x + space + this.options.arcRadius, y, item.width)
                    .addTo(this);
                
                x += width + this.options.arcRadius;
                y += item.height;
            } else if(i < this.items.length - 1) {
                path(x, top)
                    .right(3 * this.options.arcRadius + Math.max(width, this.options.arcRadius))
                    .arc('North', 'East')
                    .vDown(y - top + item.height - 2 * this.options.arcRadius)
                    .arc('West', 'South')
                    .addTo(this);
                
                path(x, y)
                    .right(2 * this.options.arcRadius)
                    .addTo(this);
                
                item.format(x + 2 * this.options.arcRadius, y, item.width)
                    .addTo(this);

                path(x + item.width + 2 * this.options.arcRadius, y + item.height)
                    .right(space + this.options.arcRadius)
                    .addTo(this);
                
                path(x, y)
                    .arc('North', 'East')
                    .vDown(item.height + Math.max(item.down + this.options.verticalSeparation, 2 * this.options.arcRadius) - 2 * this.options.arcRadius)
                    .arc('West', 'South')
                    .right(width - this.options.arcRadius)
                    .arc('South', 'East')
                    .vUp(item.down + this.options.verticalSeparation - 2 * this.options.arcRadius)
                    .arc('West', 'North')
                    .addTo(this);
                
                x += 3 * this.options.arcRadius + Math.max(width, this.options.arcRadius);
                y += item.height;
            } else {
                path(x, y)
                    .right(2 * this.options.arcRadius)
                    .addTo(this);
                
                item.format(x + 2 * this.options.arcRadius, y, item.width)
                    .addTo(this);
                
                path(x + 2 * this.options.arcRadius + item.width, y + item.height)
                    .right(space + this.options.arcRadius)
                    .addTo(this);
                
                path(x, y)
                    .arc('North', 'East')
                    .vDown(item.height + Math.max(item.down + this.options.verticalSeparation, 2 * this.options.arcRadius) - 2 * this.options.arcRadius)
                    .arc('West', 'South')
                    .right(width - this.options.arcRadius)
                    .arc('South', 'East')
                    .vUp(item.down + this.options.verticalSeparation - 2 * this.options.arcRadius)
                    .arc('West', 'North')
                    .addTo(this);
            }
        }

        return this;
    }
}