export const isString = (val: any): val is string =>
  val && typeof val === "string"

export const isActiveString = (val: any) => isString(val) && val.length > 0

export const isNotNull = (val: any) => val !== null

export const confirmTargetTag = (elem: HTMLElement, targetTag: string) =>
  elem &&
  isString(elem.tagName) &&
  elem.tagName.toUpperCase() === targetTag.toUpperCase()
