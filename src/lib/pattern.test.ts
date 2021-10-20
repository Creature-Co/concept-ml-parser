import { parseConcept, parseConcepts } from '../lang/parser';

import {
  extractVariables,
  interpolate,
  interpolateToConcepts,
} from './pattern';

describe('extractVariables', () => {
  test('flat pattern', () => {
    const variables = extractVariables(
      parseConcept('a b c'),
      parseConcept('$1 b $2'),
    );

    expect(variables).toMatchObject({
      $1: { key: 'a' },
      $2: { key: 'c' },
    });
  });

  test('compound pattern', () => {
    const variables = extractVariables(
      parseConcept('a [b c]'),
      parseConcept('$1 [b $2]'),
    );

    expect(variables).toMatchObject({
      $1: { key: 'a' },
      $2: { key: 'c' },
    });
  });

  test('deep pattern', () => {
    const variables = extractVariables(
      parseConcept('a [b [c [d e]]] f'),
      parseConcept('a [$1 [c [d $2]]] $3'),
    );

    expect(variables).toMatchObject({
      $1: { key: 'b' },
      $2: { key: 'e' },
      $3: { key: 'f' },
    });
  });

  test('variable dissonance', () => {
    const variables = extractVariables(
      parseConcept('a [b [c [d e]]] f'),
      parseConcept('a [$1 [c [d $2]]] $2'),
    );

    expect(variables).toEqual(null);
  });
});

describe('interpolate', () => {
  test('inserts concept keys into variables', () => {
    const out = interpolate('[[a $1] b $2] $3 [<<a literal value>> c] d', {
      $1: parseConcept('var1'),
      $2: parseConcept('var2'),
      $3: parseConcept('var3'),
      '<<a literal value>> c': parseConcept('<<a different value>> c'),
    });

    expect(out).toEqual('[[a var1] b var2] var3 [<<a different value>> c] d');
  });
});

describe('interpolateToConcepts', () => {
  test('respects template permutations', () => {
    const out = interpolateToConcepts(
      `
      {$1, $2} is programmer
    `,
      {
        $1: parseConcept('john'),
        $2: parseConcept('jane'),
      },
    );

    expect(out.map((c) => c.key)).toMatchObject([
      'john is programmer',
      'jane is programmer',
    ]);
  });

  test('respects variable permutations', () => {
    const out = interpolateToConcepts(
      `
      $1 is programmer
    `,
      {
        $1: parseConcepts('john, jane'),
      },
    );

    expect(out.map((c) => c.key)).toMatchObject([
      'john is programmer',
      'jane is programmer',
    ]);
  });
});
