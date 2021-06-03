import { Token, TokenError } from '../../lib/token';
import { AtomKind, TextBlockKind } from '../token-kinds';
import { Block, Root, Permutation, Atom, TextBlock } from './nodes';

export interface ASTParserContext {
  parent?: ASTParserContext;
  block: Block | Root;
  permutation: Permutation;
}

export class ASTParserState {
  root: Root;
  context: ASTParserContext;

  constructor() {
    const permutation: Permutation = {
      type: 'Permutation',
      children: [],
    };

    const root: Root = {
      type: 'Root',
      children: [permutation],
    };

    this.context = { permutation, block: root };
    this.root = root;
  }

  end() {
    let context = this.context;

    while (context) {
      this.terminatePermutation();
      context = context.parent;
    }

    return this;
  }

  terminatePermutation() {
    if (this.context.permutation.children.length === 0) {
      this.context.block.children.pop();
    }

    return this;
  }

  consumeAtomToken(token: Token) {
    if (token.kind !== AtomKind) {
      throw new TokenError('Token must be an Atom', token);
    }

    const atom: Atom = {
      token,
      type: 'Atom',
      text: token.loc.source,
    };

    this.context.permutation.children.push(atom);

    return this;
  }

  consumeTextBlockToken(token: Token) {
    if (token.kind !== TextBlockKind) {
      throw new TokenError('Token must be a TextBlock', token);
    }

    const textBlock: TextBlock = {
      token,
      type: 'TextBlock',
      text: token.loc.source,
    };

    this.context.permutation.children.push(textBlock);

    return this;
  }

  nextPermutation() {
    this.terminatePermutation();

    const permutation: Permutation = {
      type: 'Permutation',
      children: [],
    };

    this.context.block.children.push(permutation);
    this.context.permutation = permutation;

    return this;
  }

  startPermutationBlock(type: Block['type']) {
    const permutation: Permutation = {
      type: 'Permutation',
      children: [],
    };

    const block: Block = {
      type,
      children: [permutation],
    };

    this.context.permutation.children.push(block);

    this.context = {
      block,
      permutation,
      parent: this.context,
    };

    return this;
  }

  endPermutationBlock() {
    const { parent } = this.context;

    if (!parent) {
      throw new Error('Unexpected block ending');
    }

    this.terminatePermutation();
    this.context = this.context.parent;

    return this;
  }
}
