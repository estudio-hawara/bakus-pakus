import { Attributes } from "../../railroad/attributes";
import { FakeSVG } from "../../railroad/fake_svg";
import { Terminal } from "../../railroad/terminal";
import { DiagramContainer } from "../../railroad/diagram_container";

describe('Railroad / DiagramContainer', () => {

    describe('Constructor', () => {

        it('can be instantiated without explicit attributes', () => {
            const tag = 'div';
            const items: FakeSVG[] = [];
            const container = new DiagramContainer(tag, undefined, items);

            expect(container.tag).toBe(tag);
        });

        it('should initialize properties correctly', () => {
            const tag = 'div';
            const attributes = new Attributes();
            const items: FakeSVG[] = [];
            const container = new DiagramContainer(tag, attributes, items);

            expect(container.tag).toBe(tag);
            expect(container.attributes).toEqual(attributes);
        });

    });

    describe('Method: walk', () => {

        it('should call the callback for itself and all items', () => {
            const tag = 'div';
            const attributes = new Attributes();
            const child = new Terminal('Child');
            const items: FakeSVG[] = [child];
            const container = new DiagramContainer(tag, attributes, items);

            const mockCallback = jest.fn();

            container.walk(mockCallback);

            expect(mockCallback).toHaveBeenCalledWith(child);
        });

    });

});