"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("../lang/parser");
const concept_1 = require("./concept");
describe('Concept class', () => {
    describe('@shape', () => {
        test('returns 0 for atom', () => {
            const concept = concept_1.Concept.createAtom('test-atom');
            expect(concept.shape).toStrictEqual(0);
        });
        test('returns 3 for shallow compound with 3 parts', () => {
            const concept = parser_1.parseConcept('part1 part2 part3');
            expect(concept.shape).toStrictEqual(3);
        });
        test('returns [0,2,0] for concept with a nested 2-compound surrounded by 2 atoms', () => {
            const concept = parser_1.parseConcept('part1 [part2 part3] part4');
            expect(concept.shape).toMatchObject([0, 2, 0]);
        });
        test('returns [0,2,[0,3]] for highly nested object', () => {
            const concept = parser_1.parseConcept('part1 [part2 part3] [part4 [part5 part6 part7]]');
            expect(concept.shape).toMatchObject([0, 2, [0, 3]]);
        });
    });
});
describe('Concept helpers', () => {
    describe('isAtom', () => {
        test('returns true for atoms', () => {
            expect(concept_1.isAtom(parser_1.parseConcept('atom'))).toStrictEqual(true);
        });
        test('returns false for compounds', () => {
            expect(concept_1.isAtom(parser_1.parseConcept('a compound'))).toStrictEqual(false);
        });
    });
    describe('isCompound', () => {
        test('returns true for compounds', () => {
            expect(concept_1.isCompound(parser_1.parseConcept('a compound'))).toStrictEqual(true);
        });
        test('returns false for atoms', () => {
            expect(concept_1.isCompound(parser_1.parseConcept('atom'))).toStrictEqual(false);
        });
    });
    describe('isVariable', () => {
        test('returns true for variables', () => {
            expect(concept_1.isVariable(parser_1.parseConcept('$variable'))).toStrictEqual(true);
        });
        test('returns false for atoms', () => {
            expect(concept_1.isVariable(parser_1.parseConcept('atom'))).toStrictEqual(false);
        });
        test('returns false for compounds', () => {
            expect(concept_1.isVariable(parser_1.parseConcept('compound with $variable'))).toStrictEqual(false);
        });
    });
    describe('isPattern', () => {
        test('returns true for patterns', () => {
            expect(concept_1.isPattern(parser_1.parseConcept('[$variable in] a pattern'))).toStrictEqual(true);
        });
        test('returns false for variables', () => {
            expect(concept_1.isPattern(parser_1.parseConcept('$variable'))).toStrictEqual(false);
        });
        test('returns false for compounds without variables', () => {
            expect(concept_1.isPattern(parser_1.parseConcept('a compound [without variables]'))).toStrictEqual(false);
        });
    });
    describe('isTextBlock', () => {
        test('return true for text blocks', () => {
            expect(concept_1.isTextBlock(parser_1.parseConcept(`
            <<
              A text block
              with multiple
              lines.
            >>
          `))).toStrictEqual(true);
        });
    });
});
//# sourceMappingURL=concept.test.js.map