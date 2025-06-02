import { Comment } from '@app/railroad/comment';
import { Options } from '@railroad/options';
import { FakeSVG } from '@railroad/fake_svg';
import * as tags from '@railroad/tags';

describe('Railroad / Comment', () => {

    describe('Constructor', () => {

        it('should create a group element with comment class', () => {
            const comment = new Comment('Test Comment');

            expect(comment).toBeInstanceOf(Comment);
            expect(comment.tag).toBe('g');
            expect(comment.needsSpace).toBe(true);
        });

        it('should set default values when href and title are not provided', () => {
            const comment = new Comment('Test Comment');

            expect(comment.needsSpace).toBe(true);
            expect(comment.up).toBe(8);
            expect(comment.down).toBe(8);
        });

        it('should calculate width based on text length', () => {
            const text = 'Test Comment';
            const options = new Options({ defaultCharWidth: 8 });
            const comment = new Comment(text, null, null, options);

            expect(comment.width).toBe(text.length * options.defaultCharWidth + 10);
        });

        it('should add debug attributes when debug mode is on', () => {
            const options = new Options({ debug: true });
            const comment = new Comment('Debug Comment', null, null, options);

            expect(comment.attributes.get('data-updown')).toBe('8 8');
            expect(comment.attributes.get('data-type')).toBe('comment');
        });

    });

    describe('Method: format', () => {

        it('should create paths for left and right gaps', () => {
            const comment = new Comment('Test Comment');
            const pathSpy = jest.spyOn(tags, 'path');

            comment.format(10, 20, 100);

            expect(pathSpy).toHaveBeenCalled();
            pathSpy.mockRestore();
        });

        it('should add text element with correct positioning', () => {
            const text = 'Test Comment';
            const comment = new Comment(text);
            const addToSpy = jest.spyOn(FakeSVG.prototype, 'addTo');

            comment.format(10, 20);

            // Check that a text element was added
            const textElement = addToSpy.mock.calls.find(call => 
                (call[0].children as FakeSVG[])
                    .some((child: any) => child.tag === 'text' && child.children === text)
            );
            expect(textElement).toBeDefined();

            addToSpy.mockRestore();
        });

        it('should wrap text in an anchor when href is provided', () => {
            const text = 'Test Comment';
            const href = 'https://example.com';
            const comment = new Comment(text, href);
            const addToSpy = jest.spyOn(FakeSVG.prototype, 'addTo');

            comment.format(10, 20);

            // Check that an anchor element was added
            const anchorElement = addToSpy.mock.calls.find(call => 
                (call[0].children as FakeSVG[])
                    .some((child: any) => child.tag === 'a' && child.attributes.get('xlink:href') === href)
            );
            expect(anchorElement).toBeDefined();

            addToSpy.mockRestore();
        });

        it('should add title element when title is provided', () => {
            const text = 'Test Comment';
            const title = 'Comment Title';
            const comment = new Comment(text, null, title);
            const addToSpy = jest.spyOn(FakeSVG.prototype, 'addTo');

            comment.format(10, 20);

            // Check that a title element was added
            const titleElement = addToSpy.mock.calls.find(call => 
                (call[0].children as FakeSVG[])
                    .some((child: any) => child.tag === 'title' && child.children === title)
            );
            expect(titleElement).toBeDefined();

            addToSpy.mockRestore();
        });

        it('should return the comment itself after formatting', () => {
            const comment = new Comment('Test Comment');
            const result = comment.format(10, 20);

            expect(result).toBe(comment);
        });

    });
    
});
