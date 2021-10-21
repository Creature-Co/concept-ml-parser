import { Concept, parseConcept } from '..';
import { applyAmpersandOperator } from './operators';

describe('applyAmpersandOperator', () => {
  describe('no ampersands present', () => {
    test('returns concept as-is', () => {
      expect(
        applyAmpersandOperator(
          Concept.createCompound(['i', 'am', 'a', 'concept']),
        ).key,
      ).toEqual('i am a concept');
    });
  });

  describe('ampersands in shallow compound', () => {
    test('replaces ampersand with first part', () => {
      expect(
        applyAmpersandOperator(Concept.createCompound(['world', 'hello', '&']))
          .key,
      ).toEqual('hello world');
    });
  });

  describe('ampersands in deep compound', () => {
    test('replaces ampersand with first part', () => {
      const applied = applyAmpersandOperator(
        Concept.createCompound([
          'c',
          Concept.createCompound(['a', Concept.createCompound(['b', '&'])]),
        ]),
      );

      expect(applyAmpersandOperator(applied).key).toEqual('a [b c]');
    });
  });
});
