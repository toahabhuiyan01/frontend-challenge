import { useState } from "react";
import { Plus } from "lucide-react";
import { ToDoType } from "../../types";
import { getRandomString } from "@/utils";

type ToDoCreateProps = {
    onSave: (todo: ToDoType) => void
}

const DEFAUL_TODO = () => ({
    id: getRandomString(),
    title: '',
    isCompleted: false
})

export function TodoCreate({ onSave }: ToDoCreateProps) {
    const [todo, setTodo] = useState(DEFAUL_TODO())

    return (
        <form 
            className="todo-container relative w-full flex flex-col sm:flex-row items-center mt-2"
        >
            <div
                className="input-group flex flex-row items-center w-full gap-4"
            >
                <div className={`h-6 w-6 bg-violet-700 hover:bg-violet-800 flex items-center justify-center rounded-full p-1`}>
                    <Plus color="#ffffff" strokeWidth={4} />
                </div>
                <input
                    autoFocus
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
                type="submit"
                className="bg-violet-700 hover:bg-violet-800 h-10 w-full sm:w-32 right-2 top-2 text-md px-2 py-1 text-white block sm:absolute rounded-md"
                disabled={!todo.title}
                onClick={() => {
                    onSave(todo)
                    setTodo(DEFAUL_TODO())
                }}
            >
                Add Item
            </button>
        </form>
    )
}