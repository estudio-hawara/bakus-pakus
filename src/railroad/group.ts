import { Comment } from "@app/railroad/comment";
import { FakeSVG } from "@app/railroad/fake_svg";
import { Options } from "@app/railroad/options";
import { path, rect } from "@app/railroad/tags";
import { determineGaps } from "@app/railroad/utils";

export class Group extends FakeSVG
{
    #item: FakeSVG;
    #label: Comment | null = null;

    #boxUp: number;

    constructor(
        item: FakeSVG,
        label: string | null = null,
        options: Options = new Options
    ) {
        super('g', {}, undefined, undefined, options);

        this.#item = item;
        this.#label = label ? new Comment(label, null, null, options) : null;
        this.#boxUp = this.up = Math.max(this.#item.up + this.options.verticalSeparation, this.options.arcRadius);

        this.needsSpace = true;

        this.width = Math.max(
            this.#item.width + (this.#item.needsSpace ? 20 : 0),
            this.#label ? this.#label.width : 0,
            2 * this.options.arcRadius,
        );

        this.height = this.#item.height;

        if (this.#label)
            this.up += this.#label.up + this.#label.height + this.#label.down;
    
        this.down = Math.max(this.#item.down + this.options.verticalSeparation, this.options.arcRadius);

        if(this.options.debug) {
            this.attributes.add('data-updown', `${this.up} ${this.down}`);
            this.attributes.add('data-type', 'group');
        }
    }

    format(
        x: number = 0,
        y: number = 0,
        width: number = 0
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
   
        this.#item.format(x, y, this.width)
            .addTo(this);

        rect({
            x: x,
            y: y - this.#boxUp,
            width: this.width,
            height: this.#boxUp + this.height + this.down,
            rx: this.options.arcRadius,
            ry: this.options.arcRadius,
            class: 'group-box',
        }).addTo(this);

        if (this.#label)
            this.#label.format(
                x,
                y - this.#boxUp - this.#label.down - this.#label.height,
                this.#label.width,
            ).addTo(this);

        return this;
    }

    walk(callback: Function)
    {
        callback(this);
        this.#item.walk(callback)
        if (this.#label)
            this.#label.walk(callback);
    }
}