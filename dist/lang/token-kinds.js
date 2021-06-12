"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtomKind = exports.TextBlockKind = exports.SemicolonKind = exports.CommaKind = exports.ParenRightKind = exports.ParenLeftKind = exports.SquareRightKind = exports.SquareLeftKind = exports.CurlyRightKind = exports.CurlyLeftKind = exports.WhitespaceKind = exports.NewlineSeparatorKind = void 0;
const token_1 = require("../lib/token");
exports.NewlineSeparatorKind = token_1.RegExpTokenKind('NewlineSeparator', /^([ \t]*\n[ \t]*)+/);
exports.WhitespaceKind = token_1.RegExpTokenKind('Whitespace', /^[ \t]+/);
exports.CurlyLeftKind = token_1.RegExpTokenKind('CurlyLeft', /^\{/);
exports.CurlyRightKind = token_1.RegExpTokenKind('CurlyRight', /^\}/);
exports.SquareLeftKind = token_1.RegExpTokenKind('SquareLeft', /^\[/);
exports.SquareRightKind = token_1.RegExpTokenKind('SquareRight', /^\]/);
exports.ParenLeftKind = token_1.RegExpTokenKind('ParenLeft', /^\(/);
exports.ParenRightKind = token_1.RegExpTokenKind('ParenRight', /^\)/);
exports.CommaKind = token_1.RegExpTokenKind('ParenRight', /^,/);
exports.SemicolonKind = token_1.RegExpTokenKind('ParenRight', /^;/);
exports.TextBlockKind = token_1.RegExpTokenKind('TextBlock', /^<<(.|\n)+?>>/);
exports.AtomKind = token_1.RegExpTokenKind('Atom', /^[^ \n\t\{\}\[\]\(\)\,\;]+/);
//# sourceMappingURL=token-kinds.js.map