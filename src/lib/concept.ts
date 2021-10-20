export type ConceptSequence = Concept[];

export type ConceptShape = number | (number | ConceptShape)[];

export class Concept {
  key: string;
  parts: ConceptSequence;
  shape: ConceptShape;

  constructor(inputs: { key?: string; parts?: Concept[] }) {
    const parts = inputs.parts || [];
    const key =
      parts.length > 0
        ? Concept.join(inputs.parts as Concept[])
        : inputs.key || '';

    this.key = key;
    this.parts = parts;
    this.shape = Concept.computeShape(this);
  }

  static computeShape(concept: Concept): ConceptShape {
    if (concept.parts.length === 0) {
      return 0;
    }

    const subdims = concept.parts.map(Concept.computeShape);

    if (subdims.every((dim) => dim === 0)) {
      return subdims.length;
    }

    return subdims;
  }

  static createAtom(key: string): Concept {
    return new Concept({ key });
  }

  static createCompound(
    parts: (Concept | ConceptSequence | string)[],
  ): Concept {
    return new Concept({
      parts: parts.map((part) => {
        if (Array.isArray(part)) {
          return Concept.createCompound(part);
        }

        if (part instanceof Concept) {
          return part;
        }

        return Concept.createAtom(part);
      }),
    });
  }

  static join(parts: Concept[]): string {
    return parts
      .map((part) => (part.parts.length >= 2 ? `[${part.key}]` : part.key))
      .join(' ');
  }

  toString() {
    return this.key;
  }
}

export const NULL_CONCEPT = Concept.createAtom('');

export const filterUniqueConcepts = (concepts: Concept[]): Concept[] => {
  const map = new Map<string, Concept>();
  concepts.forEach((concept) => map.set(concept.key, concept));
  return Array.from(map.values());
};

export const getConceptsDeep = (topConcepts: Concept[]): Concept[] => {
  const map = new Map<string, Concept>();

  topConcepts.forEach((c) => {
    map.set(c.key, c);
    getConceptsDeep(c.parts).forEach((sub) => {
      map.set(sub.key, sub);
    });
  });

  return Array.from(map.values());
};

export const isAtom = (concept: Concept): boolean => {
  return concept.parts.length === 0;
};

export const isVariable = (concept: Concept): boolean => {
  return isAtom(concept) && concept.key[0] === '$';
};

export const isPattern = (concept: Concept): boolean => {
  return (
    isCompound(concept) &&
    concept.parts.some((part) => {
      return isVariable(part) || isPattern(part);
    })
  );
};

export const isCompound = (concept: Concept): boolean => {
  return concept.parts.length > 1;
};

export const isTextBlock = (concept: Concept): boolean => {
  return concept.key.slice(0, 2) + concept.key.slice(-2) === '<<>>';
};
