import { Token, tokenize } from '../lib/token';
import { Concept, filterUniqueConcepts, NULL_CONCEPT } from '../lib/concept';
import { parseAST } from './ast';
import * as tokenKinds from './token-kinds';
import { combine } from '../lib/util';
import { applyAmpersandOperator } from '../lib/operators';

import {
  ASTNode,
  Atom,
  EmbeddedPermutationBlock,
  ParentheticalPermutationBlock,
  Permutation,
  PermutationBlock,
  Root,
  TextBlock,
} from './ast/nodes';

export interface ParseConceptsResult {
  source: string;
  tokens: Token[];
  ast: Root;
  tokenTree: TokenTree;
  concepts: Concept[];
}

export type TokenTree = (Token | TokenTree)[];

export const parseConcepts = (source: string | string[]): Concept[] => {
  source = Array.isArray(source) ? source.join('\n') : source;

  const tokens = tokenize(source, Object.values(tokenKinds));
  const ast = parseAST(tokens);
  const tokenTree = astToTokenTree(ast);
  const concepts = filterUniqueConcepts(tokenTree.map(tokenTreeToConcept));

  return concepts;
};

export const parseConcept = (source: string): Concept => {
  return parseConcepts(source)[0] || NULL_CONCEPT;
};

export type KeyOrConcept = string | Concept;

export type ConceptSetSource = string | Concept | (string | Concept)[];

export const toConcept = (keyOrConcept: KeyOrConcept): Concept => {
  if (keyOrConcept instanceof Concept) {
    return keyOrConcept;
  }

  return Concept.createAtom(keyOrConcept);
};

export const toConcepts = (source: ConceptSetSource): Concept[] => {
  if (Array.isArray(source)) {
    return source.flatMap(toConcepts);
  }

  if (source instanceof Concept) {
    return [source];
  }

  return parseConcepts(source);
};

export const tokenTreeToConcept = (tokenTree: TokenTree): Concept | null => {
  if (tokenTree.length === 0) {
    return null;
  }

  const recurse = (branch: TokenTree) => {
    const parts = branch
      .map((branch) => {
        return Array.isArray(branch)
          ? recurse(branch)
          : Concept.createAtom(branch.loc.source);
      })
      .filter(Boolean);

    if (parts.length === 1) {
      return parts[0];
    }

    return Concept.createCompound(parts);
  };

  const concept = recurse(tokenTree);

  return applyAmpersandOperator(concept);
};

export const astToTokenTree = (root: ASTNode): TokenTree => {
  const emitted: TokenTree = [];

  const recurse = (
    node: ASTNode,
    prevSubPerms: TokenTree[] = [],
  ): TokenTree[] => {
    switch (node.type) {
      case 'Atom':
        return [[(node as Atom).token]];

      case 'TextBlock':
        return [[(node as TextBlock).token]];

      case 'Root': {
        const root = node as Root;
        return root.children.flatMap((child) => recurse(child, []));
      }

      case 'PermutationBlock': {
        const block = node as PermutationBlock;
        return block.children.flatMap((child) => recurse(child, []));
      }

      case 'ParentheticalPermutationBlock': {
        const block = node as ParentheticalPermutationBlock;

        block.children.forEach((child) => {
          const combinations = combine(prevSubPerms, recurse(child));
          emitted.push(...combinations);
        });

        return [];
      }

      case 'EmbeddedPermutationBlock': {
        const block = node as EmbeddedPermutationBlock;

        return block.children.flatMap((child) => {
          return recurse(child, []).map((embed) => [embed]);
        });
      }

      case 'Permutation': {
        const permutation = node as Permutation;
        let subPrefixes: TokenTree[] = [];
        let prevSubPerms: TokenTree[] = [];

        permutation.children.forEach((segment) => {
          const subPerms = recurse(segment, prevSubPerms);

          if (subPrefixes.length === 0) {
            subPrefixes = subPerms;
          } else if (subPerms.length > 0) {
            subPrefixes = subPrefixes.flatMap((left) => {
              return subPerms.map((right) => {
                return [...left, ...right];
              });
            });
          }

          prevSubPerms = subPerms;
        });

        return subPrefixes;
      }

      default:
        throw new Error('Unhandled AST node type: ' + node.type);
    }
  };

  const recursed = recurse(root);

  return [...recursed, ...emitted];
};
