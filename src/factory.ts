export type NodeType = string;

export type BaseNode = {
  type: NodeType;
};

export type IdentifierNode = BaseNode & {
  value: string;
};

export type TerminalNode = BaseNode & {
  value: string;
};

export type UnaryNode = BaseNode & {
  value: RhsNode;
};

export type BinaryNode = BaseNode & {
  left: RhsNode;
  right: RhsNode;
};

export type GroupNode = UnaryNode;
export type RepetitionNode = UnaryNode;
export type OptionalNode = UnaryNode;
export type SpecialNode = UnaryNode;

export type ChoiceNode = BinaryNode;
export type SequenceNode = BinaryNode;

export type RhsNode = 
  | IdentifierNode 
  | TerminalNode 
  | GroupNode 
  | RepetitionNode 
  | OptionalNode 
  | ChoiceNode 
  | SequenceNode;

export type RuleNode = BaseNode & {
  identifier: IdentifierNode;
  rhs: RhsNode;
};

export type GrammarNode = BaseNode & {
  rules: RuleNode[];
};

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

    Special(value: RhsNode): SpecialNode
    {
        return {
            type: 'Special',
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