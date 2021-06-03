import { Token, TokenError } from '../../lib/token';
import { visitEach } from '../../lib/util';
import { Root } from './nodes';
import { ASTParserState } from './parser-state';

import {
  AtomKind,
  CurlyLeftKind,
  CurlyRightKind,
  SquareLeftKind,
  SquareRightKind,
  ParenLeftKind,
  ParenRightKind,
  CommaKind,
  SemicolonKind,
  NewlineSeparatorKind,
  TextBlockKind,
} from '../token-kinds';

export const parseAST = (tokens: Token[]): Root => {
  const state: ASTParserState = new ASTParserState();

  visitEach<Token>(tokens, ({ item }) => {
    try {
      switch (item.kind) {
        // Atoms and text blocks
        case AtomKind:
          state.consumeAtomToken(item);
          break;

        case TextBlockKind:
          state.consumeTextBlockToken(item);
          break;

        // Permutation blocks
        case CurlyLeftKind:
          state.startPermutationBlock('PermutationBlock');
          break;

        case CurlyRightKind:
          state.endPermutationBlock();
          break;

        // Embedded permutation blocks
        case SquareLeftKind:
          state.startPermutationBlock('EmbeddedPermutationBlock');
          break;

        case SquareRightKind:
          state.endPermutationBlock();
          break;

        // Parenthetical permutation blocks
        case ParenLeftKind:
          state.startPermutationBlock('ParentheticalPermutationBlock');
          break;

        case ParenRightKind:
          state.endPermutationBlock();
          break;

        // Permutation separators
        case CommaKind:
          state.nextPermutation();
          break;

        case SemicolonKind:
          state.nextPermutation();
          break;

        case NewlineSeparatorKind:
          state.nextPermutation();
          break;

        default:
          break;
      }
    } catch (err) {
      throw new TokenError(err, item);
    }
  });

  return state.end().root;
};
