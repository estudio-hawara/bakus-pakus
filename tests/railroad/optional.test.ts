import { Optional } from '@railroad/optional';
import { FakeSVG } from '@railroad/fake_svg';
import { Options } from '@railroad/options';
import { Skip } from '@railroad/skip';

describe('Railroad / Optional', () => {
    
    describe('Constructor', () => {
        
        it('should initialize with an item', () => {
            const item = new FakeSVG('g');
            const optional = new Optional(item);

            expect(optional).toBeInstanceOf(Optional);
            expect(optional.items).toHaveLength(2); // Skip and the item
            expect(optional.items[0]).toBeInstanceOf(Skip);
            expect(optional.items[1]).toBe(item);
        });

        it('should set normal to 0 when skip is true', () => {
            const item = new FakeSVG('g');
            const optional = new Optional(item, true);

            expect(optional.normal).toBe(0);
        });

        it('should set normal to 1 when skip is false', () => {
            const item = new FakeSVG('g');
            const optional = new Optional(item, false);

            expect(optional.normal).toBe(1);
        });

        it('should add debug attributes when debug mode is on', () => {
            const item = new FakeSVG('g');
            const options = new Options({ debug: true });
            const optional = new Optional(item, false, options);

            expect(optional.attributes.get('data-updown')).toBeDefined();
            expect(optional.attributes.get('data-type')).toBe('optional');
        });

    });

    describe('Method: format', () => {
        
        it('should format both Skip and item', () => {
            const item = new FakeSVG('g');
            item.width = 50;
            item.height = 30;
            item.format = jest.fn().mockReturnValue(item);
            
            const optional = new Optional(item);
            
            optional.format();
            
            expect(item.format).toHaveBeenCalled();
        });

        it('should add multiple paths during formatting', () => {
            const item = new FakeSVG('g');
            item.width = 50;
            item.height = 30;
            
            const optional = new Optional(item);
            
            const addToSpy = jest.spyOn(FakeSVG.prototype, 'addTo');
            optional.format();
            
            const pathAdditions = addToSpy.mock.calls.filter(
                call => 
                    (call[0].children as FakeSVG[])
                        .some((child: any) => child.tag === 'path'
                )
            ).length;
            
            expect(pathAdditions).toBeGreaterThanOrEqual(4);
            
            addToSpy.mockRestore();
        });

        it('should return the optional itself after formatting', () => {
            const item = new FakeSVG('g');
            const optional = new Optional(item);
            
            const result = optional.format();
            
            expect(result).toBe(optional);
        });

    });

    describe('Method: walk', () => {
        
        it('should call callback for itself and all items', () => {
            const item = new FakeSVG('g');
            const optional = new Optional(item);
            
            const callback = jest.fn();
            optional.walk(callback);
            
            expect(callback).toHaveBeenCalledTimes(3); // self, Skip, and item
            expect(callback).toHaveBeenCalledWith(optional);
            expect(callback).toHaveBeenCalledWith(item);
            expect(callback).toHaveBeenCalledWith(expect.any(Skip));
        });
        
    });

});
