"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("../lang/parser");
const pattern_1 = require("./pattern");
describe('extractVariables', () => {
    test('flat pattern', () => {
        const variables = pattern_1.extractVariables(parser_1.parseConcept('a b c'), parser_1.parseConcept('$1 b $2'));
        expect(variables).toMatchObject({
            $1: { key: 'a' },
            $2: { key: 'c' },
        });
    });
    test('compound pattern', () => {
        const variables = pattern_1.extractVariables(parser_1.parseConcept('a [b c]'), parser_1.parseConcept('$1 [b $2]'));
        expect(variables).toMatchObject({
            $1: { key: 'a' },
            $2: { key: 'c' },
        });
    });
    test('deep pattern', () => {
        const variables = pattern_1.extractVariables(parser_1.parseConcept('a [b [c [d e]]] f'), parser_1.parseConcept('a [$1 [c [d $2]]] $3'));
        expect(variables).toMatchObject({
            $1: { key: 'b' },
            $2: { key: 'e' },
            $3: { key: 'f' },
        });
    });
    test('variable dissonance', () => {
        const variables = pattern_1.extractVariables(parser_1.parseConcept('a [b [c [d e]]] f'), parser_1.parseConcept('a [$1 [c [d $2]]] $2'));
        expect(variables).toEqual(null);
    });
});
describe('interpolate', () => {
    test('inserts concept keys into variables', () => {
        const out = pattern_1.interpolate('[[a $1] b $2] $3 [<<a literal value>> c] d', {
            $1: parser_1.parseConcept('var1'),
            $2: parser_1.parseConcept('var2'),
            $3: parser_1.parseConcept('var3'),
            '<<a literal value>> c': parser_1.parseConcept('<<a different value>> c'),
        });
        expect(out).toEqual('[[a var1] b var2] var3 [<<a different value>> c] d');
    });
});
describe('interpolateToConcepts', () => {
    test('respects template permutations', () => {
        const out = pattern_1.interpolateToConcepts(`
      {$1, $2} is programmer
    `, {
            $1: parser_1.parseConcept('john'),
            $2: parser_1.parseConcept('jane'),
        });
        expect(out.map((c) => c.key)).toMatchObject([
            'john is programmer',
            'jane is programmer',
        ]);
    });
    test('respects variable permutations', () => {
        const out = pattern_1.interpolateToConcepts(`
      $1 is programmer
    `, {
            $1: parser_1.parseConcepts('john, jane'),
        });
        expect(out.map((c) => c.key)).toMatchObject([
            'john is programmer',
            'jane is programmer',
        ]);
    });
});
//# sourceMappingURL=pattern.test.js.map