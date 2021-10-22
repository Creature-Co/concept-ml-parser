import { parseConcept, parseConcepts } from './lang/parser';

// One big test case to start, to be refactored into smaller tests later.
describe('text blocks', () => {
  test('parsed as one block', () => {
    expect(parseConcept('<<hello \nworld!>>').shape).toEqual(0);
  });
});

describe('given complicated ConceptML source', () => {
  const textBlock1 = `<<
      Fun, a block of text!
    >> text block`;

  const textBlock2 = `<<
        Another block of text!
      >> text block`;

  const source = `
    {john, mary} (person, mike knows &) {
      uses {
        javascript (
          for [{frontend, backend} development]
        )
        python (for [general purpose programming])
      } (language)

      programmer
    }

    ${textBlock1}
    ${textBlock2}
  `;

  describe('when it is parsed', () => {
    test('then we should receive all permutations', () => {
      const output = parseConcepts(source)
        .map((c) => c.key)
        .sort();

      const expected = [
        'john person',
        'mary person',
        'mike knows john',
        'mike knows mary',
        'john programmer',
        'mary programmer',
        'john uses javascript',
        'john uses python',
        'mary uses javascript',
        'mary uses python',
        'javascript language',
        'python language',
        'javascript for [frontend development]',
        'javascript for [backend development]',
        'python for [general purpose programming]',
        textBlock1,
        textBlock2,
      ].sort();

      expect(output).toMatchObject(expected);
    });
  });
});
