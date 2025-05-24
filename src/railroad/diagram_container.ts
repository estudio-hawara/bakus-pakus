import { Attributes } from "./attributes";
import { FakeSVG } from "./fake_svg";
import { wrapString } from "./terminal";

export class DiagramContainer extends FakeSVG
{
    #items: FakeSVG[] = [];

    constructor(
        tag: string,
        attributes: Attributes | { [key: string]: string | number | boolean } = new Attributes,
        items: FakeSVG[],
    ) {
        super(tag, attributes);
        this.#items = items.map(wrapString);
    }

    walk(callback: Function) {
        callback(this);

        this.#items.forEach(x => x.walk(callback));
    }
}