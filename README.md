# concept-ml-parser

A parser for ConceptML, a language for expressing recursive hyperedges as plain text.

## Installation

```bash
npm i -s @creature/concept-ml-parser
# or
yarn add @creature/concept-ml-parser
```

## Usage

```typescript
import { parseConcepts } from '@creature/concept-ml';

const { concepts } = parseConcepts(`
  john {
    knows {
      c++
      python
      javascript
      typescript
    }
  }
`);
```

## Overview

ConceptML is designed for expressing rich **labeled recursive hypergraphs** in a way that is simple for people to read and write, yet structured enough for computers to parse.

It was created to be the data format for [ConceptEngine](#concept-engine), a knowledge graph built on a recursive hypergraph data model.

### Terms

We call each labeled hyperedge a **concept** in ConceptML. A **label** acts as both value and unique identifier, and each concept is composed of zero, two, or more sub-concepts. A concept with zero sub-concepts is called an **atom**, with two or more it is called a **compound**.

ConceptML also includes syntax for describing inline **permutations**. When the source is parsed, each permutation is unwound into the full expressions it is part of.

### Example

```
<<Concept Engine>> {
  used-for {
    knowledge-graph
    automation
  }
  uses {
    <<ConceptML>> (
      markup-language
    )
  }
}
```

This would expand to:

```
<<Concept Engine>> used-for knowledge-graph
<<Concept Engine>> used-for automation
<<Concept Engine>> uses <<ConceptML>>
<<ConceptML>> markup-language
```

## Syntax

### Atoms

Examples:

```
javascript
john-smith
42
1/1/2000
```

### Text Blocks

```
<<
  Here's a big old text block.
  I can write anything I'd like here.
>>
```

### Compounds

Compounds are sentence-like sequences of two or more concepts. For example:

```
javascript used-for web-development
john wrote <<I'm starting to understand this ConceptML thing!>>
```

### Embedded Compounds

Concepts are hierarchical, allowing us to express arbitrary layers of meta-relations:

```
[
  sara liked [
    [john knows javascript] since 1999
  ] at 2021-06-04T00:12:30.145
] from my-social-app
```

## Permutation Syntax

### Inline Permutation Blocks

We enclose inline permutations with `{}`, separated by commas, semicolons or newlines. They can be nested. These are all equivalent:

```
hello {world, how are you}!

hello {
  world
  how are you
}!

hello {
  world;
  how are you;
}!;
```

Each of these would parse to:

```
hello world !
hello how are you !
```

### Parenthetical Permutation Blocks

Permutations enclosed within `()` generate concepts from the immediately preceding atom or inline permutations plus the block's permutations.

Example:

```
john (person, male) knows jan (person, female)
```

This would expand to:

```
john person
john male
john knows jan
jan person
jan female
```

We can precede a parenthetical permutation block with an inline permutation block:

```
{john (male), jan (female)} (person) knows javascript
```

This would expand to:

```
john male
jan female
john person
jan person
john knows javascript
jan knows javascript
```

## Next Steps

[ConceptEngine](https://concept.io) provides an API and logic programming over a recursive labeled hypergraph, using ConceptML as its input format.
