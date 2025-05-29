import { OptionalSequence } from '@railroad/optional_sequence';
import { FakeSVG } from '@railroad/fake_svg';
import { Options } from '@railroad/options';
import * as tags from '@railroad/tags';

describe('Railroad / OptionalSequence', () => {

    describe('Constructor', () => {
        it('is a class', () => {
            expect(typeof OptionalSequence).toBe('function');
        });

        it('throws an error when fewer than two items are provided', () => {
            const singleItem = [new FakeSVG('g')];
            expect(() => new OptionalSequence(singleItem)).toThrow(RangeError);
            expect(() => new OptionalSequence(singleItem)).toThrow('An optional sequence requires at least two items');
        });

        it('can be created with minimum two items', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const optionalSequence = new OptionalSequence([item1, item2]);
            
            expect(optionalSequence).toBeInstanceOf(OptionalSequence);
        });

        it('uses default options when none are provided', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const optionalSequence = new OptionalSequence([item1, item2]);
            
            expect(optionalSequence.options).toBeInstanceOf(Options);
        });

        it('can use custom options', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const customOptions = new Options({ arcRadius: 15 });
            
            const optionalSequence = new OptionalSequence([item1, item2], customOptions);
            
            expect(optionalSequence.options.arcRadius).toBe(15);
        });

        it('calculates height correctly', () => {
            const item1 = new FakeSVG('g');
            item1.height = 20;
            const item2 = new FakeSVG('g');
            item2.height = 30;
            
            const optionalSequence = new OptionalSequence([item1, item2]);
            
            expect(optionalSequence.height).toBe(50);
        });

        it('sets debug attributes when debug mode is on', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            
            const debugOptions = new Options({ debug: true });
            
            const optionalSequence = new OptionalSequence([item1, item2], debugOptions);
            
            expect(optionalSequence.attributes.get('data-updown')).toBe('20 20');
            expect(optionalSequence.attributes.get('data-type')).toBe('optional-sequence');
        });

    });

    describe('Methods: format', () => {

        it('should calculate gaps using determineGaps function', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const sequence = new OptionalSequence([item1, item2]);
            
            const pathSpy = jest.spyOn(tags, 'path');
            
            sequence.format(0, 0, 100);
            
            expect(pathSpy).toHaveBeenCalled();
            
            pathSpy.mockRestore();
        });

        it('should format each item and add to sequence', () => {
            const item1 = new FakeSVG('g');
            item1.width = 50;
            item1.height = 30;
            item1.format = jest.fn().mockReturnValue(item1);
            
            const item2 = new FakeSVG('g');
            item2.width = 30;
            item2.height = 20;
            item2.format = jest.fn().mockReturnValue(item2);
            
            const sequence = new OptionalSequence([item1, item2]);
            
            sequence.format();
            
            expect(item1.format).toHaveBeenCalled();
            expect(item2.format).toHaveBeenCalled();
        });

        it('should add correct paths for first item', () => {
            const item1 = new FakeSVG('g');
            item1.needsSpace = true;
            item1.width = 50;
            item1.height = 30;
            item1.format = jest.fn().mockReturnValue(item1);
            
            const item2 = new FakeSVG('g');
            item2.width = 30;
            item2.height = 20;
            item2.format = jest.fn().mockReturnValue(item2);
            
            const sequence = new OptionalSequence([item1, item2]);
            const addToSpy = jest.spyOn(FakeSVG.prototype, 'addTo');
            
            sequence.format();
            
            const pathAdditions = addToSpy.mock.calls.filter(
                call => (call[0].children as FakeSVG[])
                    .some((child: any) => child.tag === 'path')
            ).length;
            
            expect(pathAdditions).toBeGreaterThan(2);
            
            addToSpy.mockRestore();
        });

        it('should add correct paths for middle items', () => {
            const items = [
                new FakeSVG('g'),
                new FakeSVG('g'),
                new FakeSVG('g')
            ];

            items.forEach(item => {
                item.width = 30;
                item.height = 20;
                item.format = jest.fn().mockReturnValue(item);
            });
            
            const sequence = new OptionalSequence(items);
            const addToSpy = jest.spyOn(FakeSVG.prototype, 'addTo');
            
            sequence.format();
            
            const pathAdditions = addToSpy.mock.calls.filter(
                call => (call[0].children as FakeSVG[])
                    .some((child: any) => child.tag === 'path')
            ).length;
            
            expect(pathAdditions).toBeGreaterThan(4);
            
            addToSpy.mockRestore();
        });

        it('should add correct paths for last item', () => {
            const items = [
                new FakeSVG('g'),
                new FakeSVG('g')
            ];

            items.forEach(item => {
                item.width = 30;
                item.height = 20;
                item.format = jest.fn().mockReturnValue(item);
            });
            
            const sequence = new OptionalSequence(items);
            const addToSpy = jest.spyOn(FakeSVG.prototype, 'addTo');
            
            sequence.format();
            
            const pathAdditions = addToSpy.mock.calls.filter(
                call => (call[0].children as FakeSVG[])
                    .some((child: any) => child.tag === 'path')
            ).length;
            
            expect(pathAdditions).toBeGreaterThan(3);
            
            addToSpy.mockRestore();
        });

        it('should return the sequence itself after formatting', () => {
            const item1 = new FakeSVG('g');
            const item2 = new FakeSVG('g');
            const sequence = new OptionalSequence([item1, item2]);
            
            const result = sequence.format();
            
            expect(result).toBe(sequence);
        });

    });

});