import { Path } from '../../railroad/path';
import { Options } from '../../railroad/options';

jest.mock('../../railroad/fake_svg', () => {
    return {
        FakeSVG: class MockFakeSVG {
            attributes = {
                add: jest.fn(),
                concat: jest.fn(),
            };
            options = new Options();
            
            constructor(tag: string) {}
        }
    };
});

describe('Railroad / Path', () => {
    let path: Path;
    
    beforeEach(() => {
        path = new Path(10, 20);
    });
    
    describe('constructor', () => {

        it('should create a path element with initial position', () => {
            expect(path.attributes.add).toHaveBeenCalledWith('d', 'M 10 20');
        });
        
        it('should call super with "path" tag', () => {
            // This is tested implicitly through the FakeSVG mock
            expect(path).toBeInstanceOf(Path);
        });

    });
    
    describe('isClockwise static', () => {

        it('should return true for clockwise transitions', () => {
            expect(Path.isClockwise('North', 'East')).toBe(true);
            expect(Path.isClockwise('East', 'South')).toBe(true);
            expect(Path.isClockwise('South', 'West')).toBe(true);
            expect(Path.isClockwise('West', 'North')).toBe(true);
        });
        
        it('should return false for counter-clockwise transitions', () => {
            expect(Path.isClockwise('North', 'West')).toBe(false);
            expect(Path.isClockwise('West', 'South')).toBe(false);
            expect(Path.isClockwise('South', 'East')).toBe(false);
            expect(Path.isClockwise('East', 'North')).toBe(false);
        });
        
        it('should return false for same direction', () => {
            expect(Path.isClockwise('North', 'North')).toBe(false);
            expect(Path.isClockwise('East', 'East')).toBe(false);
            expect(Path.isClockwise('South', 'South')).toBe(false);
            expect(Path.isClockwise('West', 'West')).toBe(false);
        });

    });
    
    describe('m', () => {

        it('should add relative move command', () => {
            const result = path.m(5, 10);
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' m 5 10');
            expect(result).toBe(path); // Should return this for chaining
        });
        
        it('should handle negative values', () => {
            path.m(-5, -10);
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' m -5 -10');
        });

    });
    
    describe('h', () => {

        it('should add horizontal line command', () => {
            const result = path.h(15);
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' h 15');
            expect(result).toBe(path);
        });
        
        it('should handle negative values', () => {
            path.h(-15);
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' h -15');
        });

    });
    
    describe('right', () => {

        it('should add positive horizontal movement for positive values', () => {
            const result = path.right(10);
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' h 10');
            expect(result).toBe(path);
        });
        
        it('should add zero movement for negative values', () => {
            path.right(-5);
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' h 0');
        });
        
        it('should add zero movement for zero value', () => {
            path.right(0);
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' h 0');
        });

    });
    
    describe('left', () => {

        it('should add negative horizontal movement for positive values', () => {
            const result = path.left(10);
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' h -10');
            expect(result).toBe(path);
        });
        
        it('should add zero movement for negative values', () => {
            path.left(-5);
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' h 0');
        });
        
        it('should add zero movement for zero value', () => {
            path.left(0);
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' h 0');
        });

    });
    
    describe('v', () => {

        it('should add vertical line command', () => {
            const result = path.v(15);
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' v 15');
            expect(result).toBe(path);
        });
        
        it('should handle negative values', () => {
            path.v(-15);
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' v -15');
        });

    });
    
    describe('down', () => {

        it('should add positive vertical movement for positive values', () => {
            const result = path.down(10);
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' v 10');
            expect(result).toBe(path);
        });
        
        it('should add zero movement for negative values', () => {
            path.down(-5);
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' v 0');
        });
        
        it('should add zero movement for zero value', () => {
            path.down(0);
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' v 0');
        });

    });
    
    describe('up', () => {

        it('should add negative vertical movement for positive values', () => {
            const result = path.up(10);
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' v -10');
            expect(result).toBe(path);
        });
        
        it('should add zero movement for negative values', () => {
            path.up(-5);
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' v 0');
        });
        
        it('should add zero movement for zero value', () => {
            path.up(0);
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' v 0');
        });

    });
    
    describe('l', () => {

        it('should add line to command', () => {
            const result = path.l(5, 10);
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' l 5 10');
            expect(result).toBe(path);
        });
        
        it('should handle negative values', () => {
            path.l(-5, -10);
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' l -5 -10');
        });

    });
    
    describe('format', () => {

        it('should add formatting to path', () => {
            const result = path.format();
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', 'h.5');
            expect(result).toBe(path);
        });

    });
    
    describe('arc', () => {

        beforeEach(() => {
            const options = new Options({ arcRadius: 10 });

            path = new Path(10, 20, undefined, undefined, options);
        });
        
        it('should create clockwise arc from North to East', () => {
            path.arc('North', 'East');
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' a 10 10 0 0 1 10 10');
        });
        
        it('should create counter-clockwise arc from North to West', () => {
            path.arc('North', 'West');
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' a 10 10 0 0 0 -10 10');
        });
        
        it('should create clockwise arc from East to South', () => {
            path.arc('East', 'South');
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' a 10 10 0 0 1 -10 10');
        });
        
        it('should create clockwise arc from South to West', () => {
            path.arc('South', 'West');
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' a 10 10 0 0 1 -10 -10');
        });
        
        it('should create clockwise arc from West to North', () => {
            path.arc('West', 'North');
            
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' a 10 10 0 0 1 10 -10');
        });
        
        it('should handle all counter-clockwise combinations', () => {
            path.arc('East', 'North');
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' a 10 10 0 0 0 -10 -10');
            
            jest.clearAllMocks();
            
            path.arc('South', 'East');
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' a 10 10 0 0 0 10 -10');
            
            jest.clearAllMocks();
            
            path.arc('West', 'South');
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' a 10 10 0 0 0 10 10');
        });

    });
    
    describe('semiArc', () => {

        beforeEach(() => {
            const options = new Options({ arcRadius: 10 });

            path = new Path(10, 20, undefined, undefined, options);
        });
        
        describe('Clockwise', () => {
            it('should create clockwise semi arc from North', () => {
                const result = path.semiArc('North', 'Clockwise');
                const section = 10 * Math.sin(Math.PI / 4); // ≈ 7.07
                const inversed = 10 - section; // ≈ 2.93
                
                expect(result).toBe(`a 10 10 0 0 1 ${section} ${inversed}`);
            });
            
            it('should create clockwise semi arc from North East', () => {
                const result = path.semiArc('North East', 'Clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;
                
                expect(result).toBe(`a 10 10 0 0 1 ${inversed} ${section}`);
            });
            
            it('should create clockwise semi arc from East', () => {
                const result = path.semiArc('East', 'Clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;
                
                expect(result).toBe(`a 10 10 0 0 1 -${inversed} ${section}`);
            });
            
            it('should create clockwise semi arc from South East', () => {
                const result = path.semiArc('South East', 'Clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;
                
                expect(result).toBe(`a 10 10 0 0 1 -${section} ${inversed}`);
            });
            
            it('should create clockwise semi arc from South', () => {
                const result = path.semiArc('South', 'Clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;
                
                expect(result).toBe(`a 10 10 0 0 1 -${section} -${inversed}`);
            });
            
            it('should create clockwise semi arc from South West', () => {
                const result = path.semiArc('South West', 'Clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;
                
                expect(result).toBe(`a 10 10 0 0 1 -${inversed} -${section}`);
            });
            
            it('should create clockwise semi arc from West', () => {
                const result = path.semiArc('West', 'Clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;
                
                expect(result).toBe(`a 10 10 0 0 1 ${inversed} -${section}`);
            });
            
            it('should create clockwise semi arc from North West', () => {
                const result = path.semiArc('North West', 'Clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;
                
                expect(result).toBe(`a 10 10 0 0 1 ${section} -${inversed}`);
            });

        });
        
        describe('Counter clockwise', () => {

            it('should create counter clockwise semi arc from North', () => {
                const result = path.semiArc('North', 'Counter clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;
                
                expect(result).toBe(`a 10 10 0 0 0 -${section} ${inversed}`);
            });
            
            it('should create counter clockwise semi arc from North West', () => {
                const result = path.semiArc('North West', 'Counter clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;
                
                expect(result).toBe(`a 10 10 0 0 0 -${inversed} ${section}`);
            });
            
            it('should create counter clockwise semi arc from West', () => {
                const result = path.semiArc('West', 'Counter clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;
                
                expect(result).toBe(`a 10 10 0 0 0 ${inversed} ${section}`);
            });
            
            it('should create counter clockwise semi arc from South West', () => {
                const result = path.semiArc('South West', 'Counter clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;
                
                expect(result).toBe(`a 10 10 0 0 0 ${section} ${inversed}`);
            });
            
            it('should create counter clockwise semi arc from South', () => {
                const result = path.semiArc('South', 'Counter clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;
                
                expect(result).toBe(`a 10 10 0 0 0 ${section} -${inversed}`);
            });
            
            it('should create counter clockwise semi arc from South East', () => {
                const result = path.semiArc('South East', 'Counter clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;
                
                expect(result).toBe(`a 10 10 0 0 0 ${inversed} -${section}`);
            });
            
            it('should create counter clockwise semi arc from East', () => {
                const result = path.semiArc('East', 'Counter clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;
                
                expect(result).toBe(`a 10 10 0 0 0 -${inversed} -${section}`);
            });
            
            it('should create counter clockwise semi arc from North East', () => {
                const result = path.semiArc('North East', 'Counter clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;
                
                expect(result).toBe(`a 10 10 0 0 0 -${section} -${inversed}`);
            });

        });
        
        it('should throw error for unexpected values', () => {
            expect(() => {
                // @ts-ignore - Testing runtime error with invalid inputs
                path.semiArc('Invalid', 'Invalid');
            }).toThrow('Unexpected values for a semi arc');
        });

    });
    
    describe('method chaining', () => {

        it('should allow chaining multiple path commands', () => {
            const result = path
            .m(5, 5)
            .h(10)
            .v(10)
            .l(5, 5)
            .right(15)
            .down(20);
            
            expect(result).toBe(path);
            
            // Verify all commands were called
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' m 5 5');
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' h 10');
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' v 10');
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' l 5 5');
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' h 15');
            expect(path.attributes.concat).toHaveBeenCalledWith('d', ' v 20');
        });

    });

});