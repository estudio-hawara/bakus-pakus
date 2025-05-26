import { Path } from '../../railroad/path';
import { Options } from '../../railroad/options';
import { FakeSVG } from '../../railroad/fake_svg';

describe('Railroad / Path', () => {
    
    describe('Constructor', () => {

        it('should create a path element with initial position', () => {
            const path = new Path(10, 20);

            expect(path.attributes.get('d')).toContain('M 10 20');
        });

        it('should call super with "path" tag', () => {
            const path = new Path(10, 20);

            expect(path).toBeInstanceOf(FakeSVG);
            expect(path).toBeInstanceOf(Path);
        });

    });

    describe('Static method: isClockwise', () => {

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

    describe('Method: m', () => {

        it('should add relative move command', () => {
            const path = new Path(10, 20);
            const result = path.m(5, 10);
    
            expect(path.attributes.get('d')).toContain('m 5 10');
            expect(result).toBe(path);
        });

        it('should handle negative values', () => {
            const path = new Path(10, 20);
            path.m(-5, -10);
    
            expect(path.attributes.get('d')).toContain('m -5 -10');
        });

    });
    
    describe('Method: h', () => {

        it('should add horizontal line command', () => {
            const path = new Path(10, 20);
            const result = path.h(15);
    
            expect(path.attributes.get('d')).toContain('h 15');
            expect(result).toBe(path);
        });

        it('should handle negative values', () => {
            const path = new Path(10, 20);
            path.h(-15);
    
            expect(path.attributes.get('d')).toContain('h -15');
        });

    });
    
    describe('Method: right', () => {

        it('should add positive horizontal movement for positive values', () => {
            const path = new Path(10, 20);
            const result = path.right(10);
    
            expect(path.attributes.get('d')).toContain('h 10');
            expect(result).toBe(path);
        });

        it('should add zero movement for negative values', () => {
            const path = new Path(10, 20);
            path.right(-5);
    
            expect(path.attributes.get('d')).toContain('h 0');
        });

        it('should add zero movement for zero value', () => {
            const path = new Path(10, 20);
            path.right(0);
    
            expect(path.attributes.get('d')).toContain('h 0');
        });

    });
    
    describe('Method: left', () => {

        it('should add negative horizontal movement for positive values', () => {
            const path = new Path(10, 20);
            const result = path.left(10);
    
            expect(path.attributes.get('d')).toContain('h -10');
            expect(result).toBe(path);
        });

        it('should add zero movement for negative values', () => {
            const path = new Path(10, 20);
            path.left(-5);
    
            expect(path.attributes.get('d')).toContain('h 0');
        });

        it('should add zero movement for zero value', () => {
            const path = new Path(10, 20);
            path.left(0);
    
            expect(path.attributes.get('d')).toContain('h 0');
        });

    });
    
    describe('Method: v', () => {

        it('should add vertical line command', () => {
            const path = new Path(10, 20);
            const result = path.v(15);
    
            expect(path.attributes.get('d')).toContain('v 15');
            expect(result).toBe(path);
        });

        it('should handle negative values', () => {
            const path = new Path(10, 20);
            path.v(-15);
    
            expect(path.attributes.get('d')).toContain('v -15');
        });

    });

    describe('Method: down', () => {

        it('should add positive vertical movement for positive values', () => {
            const path = new Path(10, 20);
            const result = path.vDown(10);

            expect(path.attributes.get('d')).toContain('v 10');
            expect(result).toBe(path);
        });

        it('should add zero movement for negative values', () => {
            const path = new Path(10, 20);
            path.vDown(-5);

            expect(path.attributes.get('d')).toContain('v 0');
        });

        it('should add zero movement for zero value', () => {
            const path = new Path(10, 20);
            path.vDown(0);

            expect(path.attributes.get('d')).toContain('v 0');
        });

    });

    describe('Method: up', () => {

        it('should add negative vertical movement for positive values', () => {
            const path = new Path(10, 20);
            const result = path.vUp(10);
    
            expect(path.attributes.get('d')).toContain('v -10');
            expect(result).toBe(path);
        });

        it('should add zero movement for negative values', () => {
            const path = new Path(10, 20);
            path.vUp(-5);
    
            expect(path.attributes.get('d')).toContain('v 0');
        });

        it('should add zero movement for zero value', () => {
            const path = new Path(10, 20);
            path.vUp(0);
    
            expect(path.attributes.get('d')).toContain('v 0');
        });

    });
    
    describe('Method: l', () => {

        it('should add line to command', () => {
            const path = new Path(10, 20);
            const result = path.l(5, 10);
    
            expect(path.attributes.get('d')).toContain('l 5 10');
            expect(result).toBe(path);
        });

        it('should handle negative values', () => {
            const path = new Path(10, 20);
            path.l(-5, -10);
    
            expect(path.attributes.get('d')).toContain('l -5 -10');
        });

    });
    
    describe('Method: format', () => {

        it('should add formatting to path', () => {
            const path = new Path(10, 20);
            const result = path.format();
    
            expect(path.attributes.get('d')).toContain('h.5');
            expect(result).toBe(path);
        });

    });
    
    describe('Method: arc', () => {
        it('should create clockwise arc from North to East', () => {
            const options = new Options({ arcRadius: 10 });
            const path = new Path(10, 20, undefined, undefined, options);
            path.arc('North', 'East');
    
            expect(path.attributes.get('d')).toContain('a 10 10 0 0 1 10 10');
        });

        it('should create counter-clockwise arc from North to West', () => {
            const options = new Options({ arcRadius: 10 });
            const path = new Path(10, 20, undefined, undefined, options);
            path.arc('North', 'West');
    
            expect(path.attributes.get('d')).toContain('a 10 10 0 0 0 -10 10');
        });

        it('should create clockwise arc from East to South', () => {
            const options = new Options({ arcRadius: 10 });
            const path = new Path(10, 20, undefined, undefined, options);
            path.arc('East', 'South');
    
            expect(path.attributes.get('d')).toContain('a 10 10 0 0 1 -10 10');
        });

        it('should create clockwise arc from South to West', () => {
            const options = new Options({ arcRadius: 10 });
            const path = new Path(10, 20, undefined, undefined, options);
            path.arc('South', 'West');
    
            expect(path.attributes.get('d')).toContain('a 10 10 0 0 1 -10 -10');
        });

        it('should create clockwise arc from West to North', () => {
            const options = new Options({ arcRadius: 10 });
            const path = new Path(10, 20, undefined, undefined, options);
            path.arc('West', 'North');
    
            expect(path.attributes.get('d')).toContain('a 10 10 0 0 1 10 -10');
        });

        it('should handle all counter-clockwise combinations', () => {
            const options = new Options({ arcRadius: 10 });
            const path = new Path(10, 20, undefined, undefined, options);
            path.arc('East', 'North');

            expect(path.attributes.get('d')).toContain('a 10 10 0 0 0 -10 -10');
    
            jest.clearAllMocks();    
            path.arc('South', 'East');

            expect(path.attributes.get('d')).toContain('a 10 10 0 0 0 10 -10');
    
            jest.clearAllMocks();   
            path.arc('West', 'South');

            expect(path.attributes.get('d')).toContain('a 10 10 0 0 0 10 10');
        });

    });

    describe('Method: semiArc', () => {
        describe('Clockwise', () => {
            it('should create clockwise semi arc from North', () => {
                const options = new Options({ arcRadius: 10 });
                const path = new Path(10, 20, undefined, undefined, options);
                const result = path.semiArc('North', 'Clockwise');
                const section = 10 * Math.sin(Math.PI / 4); // ≈ 7.07
                const inversed = 10 - section; // ≈ 2.93

                expect(result.attributes.get('d')).toContain(`a 10 10 0 0 1 ${section} ${inversed}`);
            });
    
            it('should create clockwise semi arc from North East', () => {
                const options = new Options({ arcRadius: 10 });
                const path = new Path(10, 20, undefined, undefined, options);
                const result = path.semiArc('North East', 'Clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;

                expect(result.attributes.get('d')).toContain(`a 10 10 0 0 1 ${inversed} ${section}`);
            });
    
            it('should create clockwise semi arc from East', () => {
                const options = new Options({ arcRadius: 10 });
                const path = new Path(10, 20, undefined, undefined, options);
                const result = path.semiArc('East', 'Clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;

                expect(result.attributes.get('d')).toContain(`a 10 10 0 0 1 -${inversed} ${section}`);
            });
    
            it('should create clockwise semi arc from South East', () => {
                const options = new Options({ arcRadius: 10 });
                const path = new Path(10, 20, undefined, undefined, options);
                const result = path.semiArc('South East', 'Clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;

                expect(result.attributes.get('d')).toContain(`a 10 10 0 0 1 -${section} ${inversed}`);
            });
    
            it('should create clockwise semi arc from South', () => {
                const options = new Options({ arcRadius: 10 });
                const path = new Path(10, 20, undefined, undefined, options);
                const result = path.semiArc('South', 'Clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;

                expect(result.attributes.get('d')).toContain(`a 10 10 0 0 1 -${section} -${inversed}`);
            });
    
            it('should create clockwise semi arc from South West', () => {
                const options = new Options({ arcRadius: 10 });
                const path = new Path(10, 20, undefined, undefined, options);
                const result = path.semiArc('South West', 'Clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;

                expect(result.attributes.get('d')).toContain(`a 10 10 0 0 1 -${inversed} -${section}`);
            });
    
            it('should create clockwise semi arc from West', () => {
                const options = new Options({ arcRadius: 10 });
                const path = new Path(10, 20, undefined, undefined, options);
                const result = path.semiArc('West', 'Clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;

                expect(result.attributes.get('d')).toContain(`a 10 10 0 0 1 ${inversed} -${section}`);
            });
    
            it('should create clockwise semi arc from North West', () => {
                const options = new Options({ arcRadius: 10 });
                const path = new Path(10, 20, undefined, undefined, options);
                const result = path.semiArc('North West', 'Clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;

                expect(result.attributes.get('d')).toContain(`a 10 10 0 0 1 ${section} -${inversed}`);
            });

        });

        describe('Counter clockwise', () => {

            it('should create counter clockwise semi arc from North', () => {
                const options = new Options({ arcRadius: 10 });
                const path = new Path(10, 20, undefined, undefined, options);
                const result = path.semiArc('North', 'Counter clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;

                expect(result.attributes.get('d')).toContain(`a 10 10 0 0 0 -${section} ${inversed}`);
            });
    
            it('should create counter clockwise semi arc from North West', () => {
                const options = new Options({ arcRadius: 10 });
                const path = new Path(10, 20, undefined, undefined, options);
                const result = path.semiArc('North West', 'Counter clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;

                expect(result.attributes.get('d')).toContain(`a 10 10 0 0 0 -${inversed} ${section}`);
            });
    
            it('should create counter clockwise semi arc from West', () => {
                const options = new Options({ arcRadius: 10 });
                const path = new Path(10, 20, undefined, undefined, options);
                const result = path.semiArc('West', 'Counter clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;

                expect(result.attributes.get('d')).toContain(`a 10 10 0 0 0 ${inversed} ${section}`);
            });
    
            it('should create counter clockwise semi arc from South West', () => {
                const options = new Options({ arcRadius: 10 });
                const path = new Path(10, 20, undefined, undefined, options);
                const result = path.semiArc('South West', 'Counter clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;

                expect(result.attributes.get('d')).toContain(`a 10 10 0 0 0 ${section} ${inversed}`);
            });
    
            it('should create counter clockwise semi arc from South', () => {
                const options = new Options({ arcRadius: 10 });
                const path = new Path(10, 20, undefined, undefined, options);
                const result = path.semiArc('South', 'Counter clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;

                expect(result.attributes.get('d')).toContain(`a 10 10 0 0 0 ${section} -${inversed}`);
            });
    
            it('should create counter clockwise semi arc from South East', () => {
                const options = new Options({ arcRadius: 10 });
                const path = new Path(10, 20, undefined, undefined, options);
                const result = path.semiArc('South East', 'Counter clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;

                expect(result.attributes.get('d')).toContain(`a 10 10 0 0 0 ${inversed} -${section}`);
            });
    
            it('should create counter clockwise semi arc from East', () => {
                const options = new Options({ arcRadius: 10 });
                const path = new Path(10, 20, undefined, undefined, options);
                const result = path.semiArc('East', 'Counter clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;

                expect(result.attributes.get('d')).toContain(`a 10 10 0 0 0 -${inversed} -${section}`);
            });
    
            it('should create counter clockwise semi arc from North East', () => {
                const options = new Options({ arcRadius: 10 });
                const path = new Path(10, 20, undefined, undefined, options);
                const result = path.semiArc('North East', 'Counter clockwise');
                const section = 10 * Math.sin(Math.PI / 4);
                const inversed = 10 - section;

                expect(result.attributes.get('d')).toContain(`a 10 10 0 0 0 -${section} -${inversed}`);
            });

        });

        it('should throw error for unexpected cardinals', () => {
            expect(() => {
                const path = new Path(10, 20);

                // @ts-ignore - Testing runtime error with invalid inputs
                path.semiArc('Invalid', 'Clockwise');
            }).toThrow(Error);
        });

        it('should throw error for unexpected spins', () => {
            expect(() => {
                const path = new Path(10, 20);

                // @ts-ignore - Testing runtime error with invalid inputs
                path.semiArc('North', 'Invalid');
            }).toThrow(Error);
        });

    });

    describe('Method chaining', () => {

        it('should allow chaining multiple path commands', () => {
            const path = new Path(10, 20);
            const result = path
                .m(5, 5)
                .h(10)
                .v(10)
                .l(5, 5)
                .right(15)
                .vDown(20);
    
            expect(result).toBe(path);
            expect(path.attributes.get('d')).toContain('m 5 5');
            expect(path.attributes.get('d')).toContain('h 10');
            expect(path.attributes.get('d')).toContain('v 10');
            expect(path.attributes.get('d')).toContain('l 5 5');
            expect(path.attributes.get('d')).toContain('h 15');
            expect(path.attributes.get('d')).toContain('v 20');
        });

    });

});