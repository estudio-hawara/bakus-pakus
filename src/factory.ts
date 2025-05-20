export type GrammarNode = {
    type: string;
    rules: RuleNode[];
};

export type RuleNode = {
    type: string;
    identifier: IdentifierNode;
    rhs: RhsNode;
}

export type RhsNode = IdentifierNode | TerminalNode | GroupNode | RepetitionNode | OptionalNode | ChoiceNode | SequenceNode;

export type GroupNode = {
    type: string;
    value: RhsNode;
}

export type RepetitionNode = {
    type: string;
    value: RhsNode;
}

export type OptionalNode = {
    type: string;
    value: RhsNode;
}

export type ChoiceNode = {
    type: string;
    left: RhsNode;
    right: RhsNode;
}

export type SequenceNode = {
    type: string;
    left: RhsNode;
    right: RhsNode;
}

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
    Grammar(rules: RuleNode[]): GrammarNode
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

    Group(value: RhsNode): GroupNode
    {
        return {
            type: 'Group',
            value,
        }
    }

    Repetition(value: RhsNode): RepetitionNode
    {
        return {
            type: 'Repetition',
            value,
        }
    }

    Optional(value: RhsNode): OptionalNode
    {
        return {
            type: 'Optional',
            value,
        }
    }

    Choice(left: RhsNode, right: RhsNode): ChoiceNode
    {
        return {
            type: 'Choice',
            left,
            right,
        };
    }

    Sequence(left: RhsNode, right: RhsNode): SequenceNode
    {
        return {
            type: 'Sequence',
            left,
            right,
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