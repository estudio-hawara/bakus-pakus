export class Factory
{
    terminal(value: string) {
        return {
            type: 'Terminal',
            value,
        };
    }
}