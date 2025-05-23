import { Children, FakeSVG } from "./fake_svg";
import { Path } from "./path";

export function title(
    text: string,
    attributes: { [key: string]: string | number | boolean } = {}
): FakeSVG
{
    return new FakeSVG('title', attributes, text);
}

export function text(
    text: string,
    attributes: { [key: string]: string | number | boolean } = {}
): FakeSVG
{
    return new FakeSVG('text', attributes, text);
}

export function rect(
    attributes: { [key: string]: string | number | boolean } = {}
): FakeSVG
{
    return new FakeSVG('rect', attributes);
}

export function path(
    x: number,
    y: number,
    attributes: { [key: string]: string | number | boolean } = {}
): Path
{
    return new Path(x, y, attributes);
}

export function a(
    attributes: { [key: string]: string | number | boolean } = {},
    children: Children = [],
) {
    return new FakeSVG('a', attributes, children);
}