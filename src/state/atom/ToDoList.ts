import { atom } from "recoil"
import { ToDoType } from "src/types"

export const todoListState = atom<ToDoType[]>({
    key: 'todoListState',
    default: []
})