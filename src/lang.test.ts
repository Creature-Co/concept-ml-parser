import { parseConcepts } from './lang/parser';

// One big test case to start, to be refactored into smaller tests later.
describe('given complicated CXL source', () => {
  const textBlock = `<<
      Fun, a block of text!
    >> text block`;

  const source = `
    {john, mary} (person) {
      uses {
        javascript (
          for [{frontend, backend} development]
        )
        python (for [general purpose programming])
      } (language)

      programmer
    }

    ${textBlock}
  `;

  describe('when it is parsed', () => {
    test('then we should receive all permutations', () => {
      const { concepts } = parseConcepts(source);
      const output = concepts.map((c) => c.text).sort();

      const expected = [
        'john person',
        'mary person',
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
        textBlock,
      ].sort();

      expect(output).toMatchObject(expected);
    });
  });
});
