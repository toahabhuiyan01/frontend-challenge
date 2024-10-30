import { useEffect, useMemo, useState } from "react";
import { Check, Edit, Plus, Trash } from "lucide-react";
import { useRecoilState } from "recoil";
import { todoListState } from "../../state/atom/ToDoList";
import { getRandomString } from "../../utils";
import { ToDoType } from "../../types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
    DialogClose
} from "../../components/ui/dialog"
import './style.css'
import { Checkbox } from "@/components/ui/checkbox";


const DEFAUL_TODO = () => ({
    id: getRandomString(),
    title: '',
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
                <p className="text-4xl font-semibold">
                    Todo List
                </p>
                <button
                    className="flex flex-row items-center border-2 hover:bg-gray-200 text-violet-700 border-violet-700 rounded-md px-2 py-1"
                    onClick={() => setHideCompleted((prev) => !prev)}
                >
                    {
                        hideCompleted ? (
                            'Show completed'
                        ) : (
                            'Hide completed'
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

                <TodoCreate
                    onSave={(todo) => {
                        setTodoList((prev) => [...prev, todo])
                        scrollToBottom()
                    }}
                />
            </div>
        </div>
    )
}

type ToDoCreateProps = {
    onSave: (todo: ToDoType) => void
}

function TodoCreate({ onSave }: ToDoCreateProps) {
    const [todo, setTodo] = useState(DEFAUL_TODO())

    return (
        <div 
            className="todo-container relative w-full flex flex-col sm:flex-row items-center mt-2"
        >
            <div
                className="input-group flex flex-row items-center w-full gap-4"
            >
                <button
                    role="checkbox"
                    aria-checked={todo.isCompleted}
                    disabled
                    onClick={() => {
                        onSave(todo)
                    }}
                    className={`h-6 w-6 bg-violet-700 hover:bg-violet-800 flex items-center justify-center rounded-full p-1`}
                >
                    <Plus color="#ffffff" strokeWidth={4} />
                </button>
                <input
                    type="text" 
                    className={`border-y border-gray-200 text-lg w-full h-14 py-2 pl-1 pr-1 sm:pr-32 active:outline-none focus:outline-none`}
                    placeholder="Memorize the dictionary" 
                    value={todo.title}
                    onChange={(e) => {
                        setTodo({
                            ...todo,
                            title: e.target.value
                        })
                    }}
                />
            </div>
            <button
                className="bg-violet-700 hover:bg-violet-800 h-10 w-full sm:w-32 right-2 top-2 text-md px-2 py-1 text-white block sm:absolute rounded-md"
                disabled={!todo.title}
                onClick={() => {
                    onSave(todo)
                    setTodo(DEFAUL_TODO())
                }}
            >
                Add Item
            </button>
        </div>
    )
}

type ToDoRenderProps = {
    todoState: ToDoType
    onSave: (id: string, todo: Partial<ToDoType> | ToDoType) => void    
    onDelete?: (id: string) => void
}
function ToDoRender({ todoState, onSave, onDelete }: ToDoRenderProps) {
    const checkboxStyles = todoState.isCompleted ? 'bg-violet-700 hover:bg-violet-800' : 'border-violet-700 hover:bg-gray-200 border-2'

    return (
        <div 
            className='todo-container relative w-full flex flex-col sm:flex-row items-center'
        >
            <div
                className="input-group flex flex-row items-center w-full gap-4"
            >
                <button
                    role="checkbox"
                    aria-checked={todoState.isCompleted}
                    onClick={() => {
                        onSave(todoState.id, { isCompleted: !todoState.isCompleted })
                    }}
                    className={`h-6 w-6 ${checkboxStyles} flex items-center justify-center rounded-full p-1`}
                >
                    {
                        todoState.isCompleted ? (
                            <Check color="#ffffff" strokeWidth={4} />
                        ) : null
                    }
                </button>
                <p
                    className={`w-full flex border-t border-gray-200 items-center text-lg h-14 py-1 pl-1 pr-1 sm:pr-32 ${todoState.isCompleted ? 'line-through' : ''}`}
                >
                    {todoState.title}
                </p>
            </div>
            <div className="actions-container hidden absolute top-2 gap-2 right-2 flex flex-row">
                <EditTodoDetails
                    todoState={todoState}
                    onSave={(id, todo) => {
                        onSave(id, todo)
                    }}
                />
                <button
                    className="hover:bg-gray-100 text-red-600 h-10 text-md px-2 py-2 rounded-full"
                    onClick={() => onDelete?.(todoState.id)}
                >
                    <Trash />
                </button>
            </div>
        </div>
    )
}

type EditTodoDetailsProps = {
    todoState: ToDoType
    onSave: (id: string, todo: ToDoType) => void
}
function EditTodoDetails({ todoState, onSave }: EditTodoDetailsProps) {
    const [todo, setTodo] = useState(todoState)

    useEffect(
        () => {
            setTodo(todoState)
        }, [todoState]
    )

    // we can add deep compare in complex objects
    const disabled = !todo.title || (todo.title === todoState.title && todo.description === todoState.description && todo.isCompleted === todoState.isCompleted)

    return (
        <Dialog
        >
            <DialogTrigger
                className="hover:bg-gray-100 text-violet-700 h-10 text-md px-2 py-2 rounded-full"
                disabled={todo.isCompleted}
                onClick={() => setTodo(todoState)}
            >
                <Edit />
            </DialogTrigger>
            <DialogContent
            >
                <DialogHeader className="font-semibold text-xl">
                    Edit ToDo
                </DialogHeader>
                <div className="flex flex-col w-full gap-4">
                    <div className="flex flex-row items-center gap-3">
                        <Checkbox 
                            checked={todo.isCompleted}
                            onClick={() => {
                                setTodo(prev => ({ ...prev, isCompleted: !prev.isCompleted }))
                            }}
                        />
                        <p>Mark as Completed</p>
                    </div>
                    <div>
                        <p className="">
                            Todo Title
                        </p>
                        <input
                            type="text" 
                            value={todo.title}
                            onChange={(e) => setTodo(prev => ({ ...prev, title: e.target.value }))}
                            className={`text-lg bg-gray-50 w-full h-14 py-2 px-3 rounded-lg active:outline-none focus:outline-none`}
                            placeholder="Memorize the dictionary" 
                        />
                    </div>
                    <div>
                        <p>
                            Todo Description
                        </p>
                        <textarea
                            value={todo.description}
                            onChange={(e) => setTodo(prev => ({ ...prev, description: e.target.value }))}
                            className={`text-lg h-24 bg-gray-50 w-full h-14 py-2 px-3 roundex-lg active:outline-none focus:outline-none`}
                            placeholder="Memorize the dictionary"
                        />
                    </div>
                    <div className="flex flex-row gap-3 w-full justify-end">
                        <DialogClose
                            className="hover:bg-gray-100 text-red-600 h-10 text-md px-2 py-2 rounded-md"
                            onClick={
                                () => {
                                    setTodo(todoState)
                                }
                            }
                        >
                                Cancel
                        </DialogClose>
                        <DialogClose
                            className="hover:bg-gray-100 text-violet-700 h-10 text-md px-2 py-2 rounded-md"
                            disabled={disabled}
                            onClick={
                                () => {
                                    onSave(todo.id, todo)
                                }
                            }
                        >
                            Save
                        </DialogClose>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}