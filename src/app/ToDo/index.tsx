import { useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { todoListState } from "../../state/atom/ToDoList";
import './style.css'
import ToDoRender from "./TodoRender";
import { TodoCreate } from "./TodoCreate";

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