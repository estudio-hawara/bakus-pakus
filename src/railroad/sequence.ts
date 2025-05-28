import { DiagramContainer } from "@railroad/diagram_container";
import { FakeSVG } from "@railroad/fake_svg";
import { Options } from "@railroad/options";
import { path } from "@railroad/tags";
import { determineGaps } from "@railroad/utils";

export class Sequence extends DiagramContainer
{
    constructor(items: FakeSVG[], options: Options = new Options)
    {
        super('g', {}, items, options);

        this.needsSpace = true;

        for (const item of this.items) {
            this.width += item.width + (item.needsSpace ? 20 : 0);
            this.height += item.height;

            this.up = Math.max(this.up, item.up - this.height);
            this.down = Math.max(this.down - this.height, item.down);
        }

        if (this.items.length && this.items[0].needsSpace)
            this.width -= 10;

        if (this.items.length && this.items[this.items.length - 1].needsSpace)
            this.width -= 10;

        if (this.options.debug) {
            this.attributes.add('data-updown', `${this.up} ${this.down}`);
            this.attributes.add('data-type', 'sequence');
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

        path(x + gaps.left + this.width, y + this.height)
            .h(gaps.right)
            .addTo(this);

        x += gaps.left;

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];

            if (item.needsSpace && i > 0) {
                path(x, y)
                    .h(10)
                    .addTo(this);
                
                x += 10;
            }

            item.format(x, y, item.width)
                .addTo(this);
            
            x += item.width;
            y += item.height;

            if (item.needsSpace && i < this.items.length - 1) {
                path(x, y)
                    .h(10)
                    .addTo(this);
                
                x += 10;
            }
        }

        return this;
    }
}