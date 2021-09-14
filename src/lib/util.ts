import { Concept } from '..';

export interface VisitorContext<T> {
  item: T;
  prev?: T;
  next?: T;
  prevAll: () => Generator<T, null>;
  nextAll: () => Generator<T, null>;
}

export const combine = <T = any>(left: T[][], right: T[][]): T[][] => {
  if (left.length === 0) {
    return right;
  }

  if (right.length === 0) {
    return left;
  }

  return left.flatMap((l) => {
    return right.map((r) => [...l, ...r]);
  });
};

export const visitEach = <T = any>(
  items: T[],
  visitor: (context: VisitorContext<T>) => any,
) => {
  items.forEach((item, i) => {
    visitor({
      item: items[i],
      prev: items[i - 1],
      next: items[i + 1],
      prevAll: function* () {
        for (let j = i - 1; j >= 0; j -= 1) {
          yield items[j];
        }

        return null;
      },
      nextAll: function* () {
        for (let j = i + 1; j < items.length; j += 1) {
          yield items[j];
        }

        return null;
      },
    });
  });
};

export const isNullConcept = (concept: Concept): boolean => {
  return concept.text === '';
};
