import { RegExpTokenKind } from '../lib/token';

export const NewlineSeparatorKind = RegExpTokenKind(
  'NewlineSeparator',
  /^([ \t]*\n[ \t]*)+/,
);

export const WhitespaceKind = RegExpTokenKind('Whitespace', /^[ \t]+/);

export const CurlyLeftKind = RegExpTokenKind('CurlyLeft', /^\{/);

export const CurlyRightKind = RegExpTokenKind('CurlyRight', /^\}/);

export const SquareLeftKind = RegExpTokenKind('SquareLeft', /^\[/);

export const SquareRightKind = RegExpTokenKind('SquareRight', /^\]/);

export const ParenLeftKind = RegExpTokenKind('ParenLeft', /^\(/);

export const ParenRightKind = RegExpTokenKind('ParenRight', /^\)/);

export const CommaKind = RegExpTokenKind('ParenRight', /^,/);

export const SemicolonKind = RegExpTokenKind('ParenRight', /^;/);

export const TextBlockKind = RegExpTokenKind('TextBlock', /^<<(.|\n)+?>>/);

export const AtomKind = RegExpTokenKind('Atom', /^[^ \n\t\{\}\[\]\(\)\,\;]+/);
