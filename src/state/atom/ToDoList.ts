import { atom } from "recoil"
import { ToDoType } from "src/types"
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const todoListState = atom<ToDoType[]>({
    key: 'todoListState',
    effects_UNSTABLE: [persistAtom],
    default: []
})