import { ASTNode } from '../../lang/ast/nodes';
import { Token } from '../../lib/token';

export interface Atom extends ASTNode {
  type: 'Atom';
  text: string;
  token: Token;
}

export interface Root extends ASTNode {
  type: 'Root';
  children: Permutation[];
}

export interface PermutationBlock extends ASTNode {
  type: 'PermutationBlock';
  children: Permutation[];
}

export interface ParentheticalPermutationBlock extends ASTNode {
  type: 'ParentheticalPermutationBlock';
  children: Permutation[];
}

export interface EmbeddedPermutationBlock extends ASTNode {
  type: 'EmbeddedPermutationBlock';
  children: Permutation[];
}

export type Block =
  | PermutationBlock
  | ParentheticalPermutationBlock
  | EmbeddedPermutationBlock;

export interface Permutation extends ASTNode {
  type: 'Permutation';
  children: PermutationSegment[];
}

export type PermutationSegment =
  | Atom
  | PermutationBlock
  | ParentheticalPermutationBlock
  | EmbeddedPermutationBlock;
