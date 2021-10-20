import { parseConcept } from '../lang/parser';

import {
  isAtom,
  isCompound,
  isPattern,
  isTextBlock,
  isVariable,
  Concept,
} from './concept';

describe('Concept class', () => {
  describe('@shape', () => {
    test('returns 0 for atom', () => {
      const concept = Concept.createAtom('test-atom');
      expect(concept.shape).toStrictEqual(0);
    });

    test('returns 3 for shallow compound with 3 parts', () => {
      const concept = parseConcept('part1 part2 part3');
      expect(concept.shape).toStrictEqual(3);
    });

    test('returns [0,2,0] for concept with a nested 2-compound surrounded by 2 atoms', () => {
      const concept = parseConcept('part1 [part2 part3] part4');
      expect(concept.shape).toMatchObject([0, 2, 0]);
    });

    test('returns [0,2,[0,3]] for highly nested object', () => {
      const concept = parseConcept(
        'part1 [part2 part3] [part4 [part5 part6 part7]]',
      );
      expect(concept.shape).toMatchObject([0, 2, [0, 3]]);
    });
  });
});

describe('Concept helpers', () => {
  describe('isAtom', () => {
    test('returns true for atoms', () => {
      expect(isAtom(parseConcept('atom'))).toStrictEqual(true);
    });

    test('returns false for compounds', () => {
      expect(isAtom(parseConcept('a compound'))).toStrictEqual(false);
    });
  });

  describe('isCompound', () => {
    test('returns true for compounds', () => {
      expect(isCompound(parseConcept('a compound'))).toStrictEqual(true);
    });

    test('returns false for atoms', () => {
      expect(isCompound(parseConcept('atom'))).toStrictEqual(false);
    });
  });

  describe('isVariable', () => {
    test('returns true for variables', () => {
      expect(isVariable(parseConcept('$variable'))).toStrictEqual(true);
    });

    test('returns false for atoms', () => {
      expect(isVariable(parseConcept('atom'))).toStrictEqual(false);
    });

    test('returns false for compounds', () => {
      expect(isVariable(parseConcept('compound with $variable'))).toStrictEqual(
        false,
      );
    });
  });

  describe('isPattern', () => {
    test('returns true for patterns', () => {
      expect(isPattern(parseConcept('[$variable in] a pattern'))).toStrictEqual(
        true,
      );
    });

    test('returns false for variables', () => {
      expect(isPattern(parseConcept('$variable'))).toStrictEqual(false);
    });

    test('returns false for compounds without variables', () => {
      expect(
        isPattern(parseConcept('a compound [without variables]')),
      ).toStrictEqual(false);
    });
  });

  describe('isTextBlock', () => {
    test('return true for text blocks', () => {
      expect(
        isTextBlock(
          parseConcept(`
            <<
              A text block
              with multiple
              lines.
            >>
          `),
        ),
      ).toStrictEqual(true);
    });
  });
});
