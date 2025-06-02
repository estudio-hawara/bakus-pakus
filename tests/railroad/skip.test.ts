import { Skip } from '@railroad/skip';
import { FakeSVG } from '@railroad/fake_svg';
import { Options } from '@railroad/options';
import * as tags from '@railroad/tags';

describe('Railroad / Skip', () => {
    
    describe('Constructor', () => {
        
        it('should initialize as a group element', () => {
            const skip = new Skip();
            
            expect(skip).toBeInstanceOf(Skip);
            expect(skip).toBeInstanceOf(FakeSVG);
            expect(skip.tag).toBe('g');
        });

        it('should add debug attributes when debug mode is on', () => {
            const options = new Options({ debug: true });
            const skip = new Skip(options);
            
            expect(skip.attributes.get('data-type')).toBe('skip');
        });
        
    });
    
    describe('Method: format', () => {
        
        it('should create path with correct coordinates', () => {
            const skip = new Skip();
            const pathSpy = jest.spyOn(tags, 'path');
            
            skip.format(10, 20, 100);
            
            expect(pathSpy).toHaveBeenCalledWith(10, 20);
            
            pathSpy.mockRestore();
        });

        it('should add horizontal line with specified width', () => {
            const skip = new Skip();
            const mockPath = {
                right: jest.fn().mockReturnThis(),
                addTo: jest.fn().mockReturnThis()
            };
            
            const pathSpy = jest.spyOn(tags, 'path').mockReturnValue(mockPath as any);
            
            skip.format(0, 0, 50);
            
            expect(mockPath.right).toHaveBeenCalledWith(50);
            expect(mockPath.addTo).toHaveBeenCalledWith(skip);
            
            pathSpy.mockRestore();
        });

        it('should return itself after formatting', () => {
            const skip = new Skip();
            const result = skip.format(0, 0, 50);
            
            expect(result).toBe(skip);
        });
        
    });

});
