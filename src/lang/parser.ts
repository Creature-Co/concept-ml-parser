import { Token, tokenize } from '../lib/token';
import { Concept, filterUniqueConcepts } from '../lib/concept';
import { parseAST } from './ast';
import * as tokenKinds from './token-kinds';
import { combine } from '../lib/util';

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

export const parseConcept = (source: string): Concept | null => {
  return parseConcepts(source)[0] || null;
};

export const tokenTreeToConcept = (tokenTree: TokenTree): Concept | null => {
  if (tokenTree.length === 0) {
    return null;
  }

  const parts = tokenTree
    .map((branch) => {
      return Array.isArray(branch)
        ? tokenTreeToConcept(branch)
        : Concept.createAtom(branch.loc.source);
    })
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0];
  }

  return Concept.createCompound(parts);
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
          emitted.push(...combine(prevSubPerms, recurse(child)));
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
