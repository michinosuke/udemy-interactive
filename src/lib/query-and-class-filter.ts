// querySelectorAll してから、クラス名の正規表現で要素を絞る
export const queryAndClassFilter = (parent: Element | Document, query: string, className: RegExp): Element[] => {
  return [...parent.querySelectorAll(query)].filter((e) => e.className.match(className));
};
