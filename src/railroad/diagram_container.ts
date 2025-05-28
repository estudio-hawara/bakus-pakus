import { Attributes } from "@railroad/attributes";
import { FakeSVG } from "@railroad/fake_svg";
import { Options } from "@railroad/options";
import { wrapString } from "@railroad/terminal";

export class DiagramContainer extends FakeSVG
{
    #items: FakeSVG[] = [];

    constructor(
        tag: string,
        attributes: Attributes | { [key: string]: string | number | boolean } = new Attributes,
        items: FakeSVG[],
        options: Options = new Options,
    ) {
        super(tag, attributes, undefined, undefined, options);
        this.#items = items.map(wrapString);
    }

    get items(): FakeSVG[]
    {
        return this.#items;
    }

    walk(callback: Function) {
        callback(this);

        this.#items.forEach(x => x.walk(callback));
    }
}