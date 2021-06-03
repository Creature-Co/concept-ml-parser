import * as uuid from 'uuid';
import { Token } from './token';

const UUID_NAMESPACE_OID = '6ba7b812-9dad-11d1-80b4-00c04fd430c8';

export type ConceptSequence = Concept[];

export class Concept {
  id: string;
  text: string;
  parts: ConceptSequence;
  token?: Token;

  constructor(inputs: { text?: string; parts?: Concept[]; token?: Token }) {
    const parts = inputs.parts || [];
    const text =
      parts.length > 0 ? Concept.join(inputs.parts) : inputs.text || '';

    this.id = uuid.v5(text, UUID_NAMESPACE_OID);
    this.text = text;
    this.parts = parts;
    this.token = inputs.token;
  }

  static createAtom(text: string) {
    return new Concept({ text });
  }

  static createCompound(parts: (Concept | ConceptSequence | string)[]) {
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
      .map((part) => (part.parts.length >= 2 ? `[${part.text}]` : part.text))
      .join(' ');
  }
}

export const filterUniqueConcepts = (concepts: Concept[]): Concept[] => {
  const map = new Map<string, Concept>();
  concepts.forEach((concept) => map.set(concept.id, concept));
  return Array.from(map.values());
};
