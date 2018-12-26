interface Selector {
  type: "id" | "class" | "tag";
  value: string;
  penalty: number;
  level: number;
}

interface Path {
  selector: string;
  items: Selector[];
  penalty: number;
}

const getTagName = (el: Element) => el.tagName.toLowerCase();
const getNthOfType = (el: Element) => {
  const tagName = getTagName(el);
  let sibling: Element = el;
  let i = 1;

  while ((sibling = sibling.previousElementSibling)) {
    if (getTagName(sibling) === tagName) i++;
  }

  return i;
};

const cartesian = <T>(...arrays: T[][]) => {
  const arrLength = arrays.length;
  let result: T[][] = arrays[0].map(v => [v]);

  for (let i = 1; i < arrLength; i++) {
    const arr = arrays[i];
    const arrLength = arr.length;
    const tempResult = Array(result.length * arr.length);

    for (let j = 0; j < result.length; j++) {
      for (let k = 0; k < arrLength; k++) {
        tempResult[k + j * arrLength] = result[j].concat(arr[k]);
      }
    }

    result = tempResult;
  }

  return result;
};

function getSelectorsForElement(el: Element, level: number): Selector[] {
  const selectors: Selector[] = [];

  if (el.id) {
    selectors.push({ type: "id", value: `[id="${el.id}"]`, penalty: 1, level });
  }

  const classesSelectors = Array.from(el.classList)
    .map(
      c =>
        ({
          type: "class",
          value: `.${c}`,
          penalty: 2,
          level
        } as Selector)
    )
    .sort(
      (a, b) =>
        document.querySelectorAll(a.value).length - document.querySelectorAll(b.value).length
    );

  if (classesSelectors.length > 0) selectors.push(classesSelectors[0]);

  const value = getTagName(el);
  const nthOfType =
    el.parentElement && el.parentElement.childElementCount > 1 ? getNthOfType(el) : 0;
  if (nthOfType && el.parentElement.getElementsByTagName(value).length > 1) {
    selectors.push({
      type: "tag",
      value: `${value}:nth-of-type(${nthOfType})`,
      penalty: 3.5,
      level
    });
  } else {
    selectors.push({ type: "tag", value, penalty: 3, level });
  }

  return selectors;
}

function optimizePath(path: Path, isUniqSelector: (selector: string) => boolean): Path {
  if (path.items.length === 1) return path;

  let newSelectors: Selector[];
  for (let i = 1; i <= path.items.length; i++) {
    newSelectors = path.items.slice(0, i);
    const selector = buildSelector(newSelectors);
    // TODO: optimize further by removing intermediary selectors
    if (isUniqSelector(selector))
      return { selector, items: newSelectors, penalty: computePenaltyForPath(newSelectors) };
  }

  return path;
}

function buildSelector(path: Selector[]) {
  const elSelector = path[0].value;
  if (path.length === 1) return elSelector;

  let result = elSelector;
  for (let i = 1; i < path.length; i++) {
    const join = path[i].level === path[i].level - 1 ? " > " : " ";
    result = path[i].value + join + result;
  }

  return result;
}

function computeNumberPenalty(selector: Selector) {
  if (selector.type === "tag") return 0;

  const selectorLength = selector.value.length;
  let numNum = 0;
  for (let i = 0; i < selectorLength; i++) {
    const charCode = selector.value.charCodeAt(i);
    if (charCode >= 48 && charCode <= 57) {
      numNum++;
    }
  }

  return numNum / selectorLength * 3;
}

function computePenaltyForPath(path: Selector[]) {
  let sum = 0;
  for (let pp of path) {
    sum += pp.penalty * pp.level + computeNumberPenalty(pp);
  }
  return sum;
}

function sortPaths(paths: Path[]) {
  return paths.slice().sort((a, b) => {
    const penaltyDifference = a.penalty - b.penalty;
    return penaltyDifference !== 0 ? penaltyDifference : a.selector.length - b.selector.length;
  });
}

function buildPath(items: Selector[]): Path {
  return {
    items,
    selector: buildSelector(items),
    penalty: computePenaltyForPath(items)
  };
}

export default function getElementUniqSelector(el: HTMLElement): string | null {
  const selectorsChain: Selector[][] = [];
  let currentEl: Element = el;
  let i = 1;

  while (currentEl && currentEl !== document.body) {
    selectorsChain.push(getSelectorsForElement(currentEl, i++));
    currentEl = currentEl.parentElement;
  }

  const uniqCache = new Map();
  const isUniqSelector = (selector: string) => {
    if (uniqCache.has(selector)) return uniqCache.get(selector);

    const isUniq = document.querySelectorAll(selector).length === 1;
    uniqCache.set(selector, isUniq);
    return isUniq;
  };

  const paths: Path[] = cartesian(...selectorsChain).map(buildPath);

  const results = sortPaths(paths)
    .slice(0, 50)
    .reduce<Path[]>((acc, path) => {
      const optimizedPath = optimizePath(path, isUniqSelector);
      if (!acc.find(p => p.selector === optimizedPath.selector)) {
        acc.push(optimizedPath);
      }
      return acc;
    }, []);
  const sortedResults = sortPaths(results);

  return results.length > 0 ? sortedResults[0].selector : null;
}
