import mutation$ from "./extension/mutation-stream"
import { map, filter, distinctUntilChanged } from "rxjs/operators"
import { confirmTargetTag, isString } from "./lib/util"
import { Album } from "./types"

const makeValue = (accumrateValue: HTMLElement | null, n: Node) => {
  const element = n as HTMLElement
  if (confirmTargetTag(element, "TITLE")) {
    return element
  }
  return accumrateValue
}

const makeAlbum = (str: string | null): Album | null => {
  if (str === null) return null
  const tmpArray = str.trim().split(/Album Review/i)
  if (!tmpArray[0]) return null
  const albumArray = tmpArray[0].split(":").map(str => str.trim())
  return { title: albumArray[0], artist: albumArray[1] }
}

const confirmAlbumReviewPage = (text: string | null): string | null => {
  if (isString(text) && text.match(/Album Review/i) !== null) {
    return text
  }
  return null
}

mutation$(document)
  .pipe(
    // I expect the only one <title> in the Document.
    map(mutations => {
      return mutations.reduce((acc, current) => {
        if (current.addedNodes.length > 0) {
          let tmp = null
          for (let i = 0, len = current.addedNodes.length; i < len; i++) {
            tmp = makeValue(acc, current.addedNodes[i])
          }
          return tmp
        } else {
          const elem = (current.target as HTMLElement).querySelector(
            "title"
          ) as Node
          return makeValue(acc, elem)
        }
      }, null)
    }),
    filter(element => element !== null),
    map<HTMLElement, string | null>(element => element.textContent),
    map(confirmAlbumReviewPage),
    distinctUntilChanged(),
    map(makeAlbum)
  )
  .subscribe(v => console.log("subscribe", v))
