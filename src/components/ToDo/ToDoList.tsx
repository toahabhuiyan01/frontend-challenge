import { useEffect, useMemo, useState } from "react";
import { Check, Edit, Plus, Trash, X } from "lucide-react";
import { useRecoilState } from "recoil";
import { todoListState } from "../../state/atom/ToDoList";
import { getRandomString } from "../../utils";
import { ToDoType } from "../../types";
import './style.css'


const DEFAUL_TODO = () => ({
    id: getRandomString(),
    text: '',
    isCompleted: false
})

const scrollToBottom = () => {
    const container = document.querySelector('.todo-list-container')
    if (container) {
        setTimeout(() => {
            container.scrollTop = container.scrollHeight
        })
    }
}

export default function ToDoList() {
    const [todoList, setTodoList] = useRecoilState(todoListState)
    const [hideCompleted, setHideCompleted] = useState(false)

    const filteredTodoList = useMemo(
        () => todoList.filter(todo => hideCompleted ? !todo.isCompleted : true),
        [todoList, hideCompleted]
    )

    return (
        <div
            className="flex flex-col px-4 gap-6 justify-center items-start"
            style={{
                width: '60rem',
                maxWidth: '100%',
            }}
        >
            <div className="w-full flex flex-row justify-between">
                <p className="text-3xl font-bold">
                    Todo List
                </p>
                <button
                    className="flex flex-row items-center border-2 hover:bg-gray-200 text-indigo-600 border-indigo-600 rounded-md px-2 py-1"
                    onClick={() => setHideCompleted((prev) => !prev)}
                >
                    {
                        hideCompleted ? (
                            <span>Show completed</span>
                        ) : (
                            <span>Hide completed</span>
                        )
                    }
                </button>
            </div>
            <div 
                className="todo-list-container w-full flex flex-col"
                style={{
                    height: '30rem',
                    overflowY: 'auto',
                }}
            >
                {
                    filteredTodoList.map((todo, index) => (
                        <ToDoRender 
                            key={index} 
                            index={index}
                            todoState={todo} 
                            onSave={(id, todo) => {
                                setTodoList((prev) => {
                                    console.log(prev)
                                    const newTodoList = [...prev]
                                    const todoToMutate = newTodoList.findIndex(todo => todo.id === id)
                                    newTodoList[todoToMutate] = {
                                        ...newTodoList[todoToMutate],
                                        ...todo
                                    }
                                    return newTodoList
                                })
                            }}
                            onDelete={(id) => {
                                setTodoList((prev) => {
                                    const newTodoList = [...prev]
                                    const todoToMutate = newTodoList.findIndex(todo => todo.id === id)
                                    newTodoList.splice(todoToMutate, 1)
                                    return newTodoList
                                })
                            }}
                        />
                    ))
                }

                <ToDoRender
                    onSave={(_, todo) => {
                        setTodoList((prev) => [...prev, (todo as ToDoType)])
                        scrollToBottom()
                    }}
                />
            </div>
        </div>
    )
}

type ToDoRenderProps = {
    index?: number,
    todoState?: ToDoType, 
    onSave: (id: string, todo: Partial<ToDoType> | ToDoType) => void    
    onDelete?: (id: string) => void
}
function ToDoRender({ index, todoState, onSave, onDelete }: ToDoRenderProps) {
    const [todo, setTodo] = useState(todoState || DEFAUL_TODO())
    const [editing, setEditing] = useState(todoState ? false : true)

    useEffect(() => {
        if (todoState) {
            setTodo(todoState)
        }
    }
    , [todoState])

    const hasChanges = useMemo(() => todo.text !== (todoState?.text || ''), [todo, todoState])
    const creating = !todoState

    const checkboxStyles = todo.isCompleted || creating ? 'bg-indigo-600 hover:bg-indigo-700' : 'border-indigo-600 hover:bg-gray-200 border-2'

    return (
        <div 
            className={`todo-container relative w-full flex flex-col sm:flex-row items-center ${creating ? 'mt-2' : 'mt-0'}`}
        >
            <div
                className="input-group flex flex-row items-center w-full gap-4"
            >
                <button
                    role="checkbox"
                    aria-checked={todo.isCompleted}
                    disabled={creating || editing}
                    onClick={() => {
                        onSave(todo.id, { isCompleted: !todo.isCompleted })
                    }}
                    className={`h-6 w-6 ${checkboxStyles} flex items-center justify-center rounded-full p-1`}
                >
                    {
                        creating ? (
                            <Plus color="#ffffff" strokeWidth={4} />
                        ) : todo.isCompleted ? (
                            <Check color="#ffffff" strokeWidth={4} />
                        ) : null
                    }
                </button>
                {
                    editing ? (
                        <input
                            type="text" 
                            id="last_name" 
                            className={`border-t border-gray-200 w-full h-14 py-2 pl-1 pr-1 sm:pr-32  active:outline-none focus:outline-none ${creating ? 'border-b' : ''}`}
                            placeholder="Memorize the dictionary" 
                            value={todo?.text}
                            onChange={(e) => {
                                setTodo({
                                    ...todo,
                                    text: e.target.value
                                })
                            }}
                        />
                    ) : (
                        <p
                            className={`w-full flex border-t border-gray-200 items-center text-lg h-14 py-1 pl-1 pr-1 sm:pr-32 ${todo.isCompleted ? 'line-through' : ''}`}
                        >
                            {todo.text}
                        </p>
                    )
                }
            </div>
            {
                creating && (
                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 h-10 w-full sm:w-32 right-2 top-2 text-md px-2 py-1 text-white block sm:absolute rounded-md"
                        disabled={!hasChanges}
                        onClick={() => {
                                onSave('', todo)
                                setTodo(DEFAUL_TODO())
                        }}
                    >
                        Add Item
                    </button>
                )
            }
            {
                editing && !creating && (
                    <div className="absolute top-2 gap-2 right-2 flex flex-row">
                        <button
                            className="hover:bg-gray-300 text-red-600 h-10 text-md px-2 py-1 rounded-full"
                            onClick={() => {
                                setEditing(false)
                                setTodo({
                                    ...todoState
                                })
                            }}
                        >
                            <X />
                        </button>
                        <button
                            className="hover:bg-gray-300 text-indigo-600 h-10 text-md px-2 py-1 rounded-full"
                            onClick={() => {
                                onSave(todo.id, { text: todo.text })
                                setEditing(false)
                            }}
                        >
                            <Check />
                        </button>
                    </div>
                )
            }
            {
                !editing && !creating && (
                    <div className="actions-container hidden absolute top-2 gap-2 right-2 flex flex-row">
                        <button
                            className="hover:bg-gray-100 text-indigo-600 h-10 text-md px-2 py-1 rounded-full"
                            disabled={todo.isCompleted}
                            onClick={() => setEditing(true)}
                        >
                            <Edit />
                        </button>
                        <button
                            className="hover:bg-gray-100 text-red-600 h-10 text-md px-2 py-1 rounded-full"
                            onClick={() => onDelete?.(todo.id)}
                        >
                            <Trash />
                        </button>
                    </div>
                )
            }
        </div>
    )
}