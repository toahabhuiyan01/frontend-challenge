import { useEffect, useState } from "react";
import { Edit } from "lucide-react"
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

type EditTodoDetailsProps = {
    todoState: ToDoType
    onSave: (id: string, todo: ToDoType) => void
}
export default function EditTodoDetails({ todoState, onSave }: EditTodoDetailsProps) {
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