export type GrammarNode = {
    type: string;
    rules: Array<RuleNode>;
};

export type RuleNode = {
    type: string;
    identifier: IdentifierNode;
    rhs: RhsNode;
}

export type RhsNode = IdentifierNode | TerminalNode;

export type IdentifierNode = {
    type: string;
    value: string;
}

export type TerminalNode = {
    type: string;
    value: string;
}

export class Factory
{
    Grammar(rules: Array<RuleNode>): GrammarNode
    {
        return {
            type: 'Grammar',
            rules,
        };
    }

    Rule(identifier: IdentifierNode, rhs: RhsNode): RuleNode
    {
        return {
            type: 'Rule',
            identifier,
            rhs,
        };
    }

    Identifier(value: string): IdentifierNode
    {
        return {
            type: 'Identifier',
            value,
        };
    }

    Terminal(value: string): TerminalNode
    {
        return {
            type: 'Terminal',
            value,
        };
    }
}