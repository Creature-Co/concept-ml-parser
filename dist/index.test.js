"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./lang/parser");
// One big test case to start, to be refactored into smaller tests later.
describe('given complicated ConceptML source', () => {
    const textBlock1 = `<<
      Fun, a block of text!
    >> text block`;
    const textBlock2 = `<<
        Another block of text!
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

    ${textBlock1}
    ${textBlock2}
  `;
    describe('when it is parsed', () => {
        test('then we should receive all permutations', () => {
            const output = parser_1.parseConcepts(source)
                .map((c) => c.text)
                .sort();
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
                textBlock1,
                textBlock2,
            ].sort();
            expect(output).toMatchObject(expected);
        });
    });
});
//# sourceMappingURL=index.test.js.map