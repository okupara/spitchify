// it seems we're still missing fromMutationObserver
// https://github.com/ReactiveX/rxjs/issues/1223
import { Subject } from "rxjs"
import { publish } from "rxjs/operators"

type MutationRecordsSubject = Subject<MutationRecord[]>

const defaultOption = {
  attributes: false,
  characterData: false,
  childList: true,
  subtree: true
}

export default (node: Node, option = defaultOption) => {
  const subject: MutationRecordsSubject = new Subject()
  const observable = publish<MutationRecord[]>()(subject.asObservable())
  observable.connect()
  const mutationObserver = new MutationObserver(mutation => {
    subject.next(mutation)
  })
  mutationObserver.observe(node, option)
  return observable
}
