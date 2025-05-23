import { FakeSVG } from '../../railroad/fake_svg';
import { Options } from '../../railroad/options';
import { Terminal } from '../../railroad/terminal';
import { determineGaps, escapeString } from '../../railroad/utils';

describe('Railroad / Utils / escapeString', () => {
    
    it('leaves strings without special characters untouched', () => {
        const original = 'hello world';
        const escaped = escapeString(original);
        
        expect(escaped).toBe(original);
    });
    
    it('replaces special characters', () => {
        const original = '<hello *world*>';
        const escaped = escapeString(original);
        
        expect(escaped).toBe('&#60;hello &#42;world&#42;&#62;');
    });
    
});

describe('Railroad / Utils / determineGaps', () => {
    
    it('should return gaps with left alignment', () => {
        const options = new Options({ internalAlignment: 'left' });
        const result = determineGaps(10, 5, options);

        expect(result).toEqual({ left: 0, right: 5 });
    });
    
    it('should return gaps with right alignment', () => {
        const options = new Options({ internalAlignment: 'right' });
        const result = determineGaps(10, 5, options);
        
        expect(result).toEqual({ left: 5, right: 0 });
    });
    
    it('should return gaps with center alignment', () => {
        const result = determineGaps(10, 5);
        
        expect(result).toEqual({ left: 2.5, right: 2.5 });
    });
    
    it('should handle negative differences', () => {
        const options = new Options({ internalAlignment: 'center' });
        const result = determineGaps(5, 10, options);
        
        expect(result).toEqual({ left: -2.5, right: -2.5 });
    });

});