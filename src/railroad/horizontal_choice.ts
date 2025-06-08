import { DiagramContainer } from "@railroad/diagram_container";
import { FakeSVG } from "@railroad/fake_svg";
import { Options } from "@railroad/options";
import { path } from "@railroad/tags";
import { determineGaps } from "@railroad/utils";

export class HorizontalChoice extends DiagramContainer
{
    #upperTrack: number;
    #lowerTrack: number;

    constructor(items: FakeSVG[], options: Options = new Options)
    {
        if (items.length < 2)
            throw new RangeError('A horizontal choice must have at least two children');

        super('g', {class: 'horizontal-choice'}, items, options);

        const allButLast = this.items.slice(0, -1);
        const middles = this.items.slice(1, -1);
        const first = this.items[0];
        const last = this.items[this.items.length - 1];

        this.needsSpace = false;

        this.width = this.options.arcRadius +
            this.options.arcRadius * 2 * (this.items.length - 1) +
            items.map(x => x.width + (x.needsSpace ? 20 : 0))
                .reduce((a: number, b: number) => a + b, 0) +
            (last.height > 0 ? this.options.arcRadius : 0) +
            this.options.arcRadius;

        this.#upperTrack = Math.max(
            this.options.arcRadius * 2,
            this.options.verticalSeparation,
			Math.max(...allButLast.map(x => x.up)) + this.options.verticalSeparation,
		);

        this.up = Math.max(this.#upperTrack, last.up);

        this.#lowerTrack = Math.max(
			this.options.verticalSeparation,
			Math.max(...middles.map(x => x.height + Math.max(x.down + this.options.verticalSeparation, this.options.arcRadius * 2))),
			last.height + last.down + this.options.verticalSeparation,
		);

        if (first.height < this.#lowerTrack)
			this.#lowerTrack = Math.max(this.#lowerTrack, first.height + this.options.arcRadius * 2);

        this.down = Math.max(this.#lowerTrack, first.height + first.down);

        if (this.options.debug) {
            this.attributes.add('data-updown', `${this.up} ${this.height} ${this.down}`);
            this.attributes.add('data-type', 'horizontal-choice');
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

        const first = this.items[0];
        const last = this.items[this.items.length - 1];
        const allButFirst = this.items.slice(1);
        const allButLast = this.items.slice(0, -1);

        const upperSpan = (
            allButLast.reduce((sum, item) => sum + item.width + (item.needsSpace ? 20 : 0), 0) +
            (this.items.length - 2) * this.options.arcRadius * 2 -
            this.options.arcRadius
        );

        path(x, y)
            .arc('South', 'East')
            .v(this.options.arcRadius * 2 - this.#upperTrack)
            .arc('West', 'North')
            .h(upperSpan)
            .addTo(this);

        const lowerSpan = (
            allButFirst.reduce((sum, item) => sum + item.width + (item.needsSpace ? 20 : 0), 0) +
            (this.items.length - 2) * this.options.arcRadius * 2 +
            (last.height > 0 ? this.options.arcRadius : 0) -
            this.options.arcRadius
        );

        const lowerStart = x +
            this.options.arcRadius +
            first.width +
            (first.needsSpace ? 20 : 0) +
            this.options.arcRadius * 2;

        path(lowerStart, y + this.#lowerTrack)
            .h(lowerSpan)
            .arc('South', 'East')
            .v(this.options.arcRadius * 2 - this.#lowerTrack)
            .arc('West', 'North')
            .addTo(this);

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];

            if (i === 0) {
                path(x, y)
                    .h(this.options.arcRadius)
                    .addTo(this);
                
                x += this.options.arcRadius;
            } else {
                path(x, y - this.#upperTrack)
                    .arc('North', 'East')
                    .v(this.#upperTrack - this.options.arcRadius * 2)
                    .arc('West', 'South')
                    .addTo(this);

                x += this.options.arcRadius * 2;
            }

            const itemWidth = item.width + (item.needsSpace ? 20 : 0);

            item.format(x, y, itemWidth)
                .addTo(this);
            
            x += itemWidth;

            if (i === this.items.length - 1) {
                if (item.height === 0) {
                    path(x, y)
                        .h(this.options.arcRadius)
                        .addTo(this);
                } else {
                    path(x, y + item.height)
                        .arc('South', 'East')
                        .addTo(this);
                }
            } else if (i === 0 && item.height > this.#lowerTrack) {
                if (item.height - this.#lowerTrack >= this.options.arcRadius * 2) {
                    path(x, y + item.height)
                        .arc('South', 'East')
                        .v(this.#lowerTrack - item.height + this.options.arcRadius * 2)
                        .arc('West', 'North')
                        .addTo(this);
                } else {
                    path(x, y + item.height)
                        .l(this.options.arcRadius * 2, this.#lowerTrack - item.height)
                        .addTo(this);
                }
            } else {
                path(x, y + item.height)
                    .arc('North', 'East')
                    .v(this.#lowerTrack - item.height - this.options.arcRadius * 2)
                    .arc('West', 'South')
                    .addTo(this);
            }
        }
        
        return this;
    }
}