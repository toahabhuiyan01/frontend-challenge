import { Check, Trash } from "lucide-react";
import { ToDoType } from "../../types";
import './style.css'
import EditTodoDetails from "./EditTodoDetails";


type ToDoRenderProps = {
    todoState: ToDoType
    onSave: (id: string, todo: Partial<ToDoType> | ToDoType) => void    
    onDelete?: (id: string) => void
}
export default function ToDoRender({ todoState, onSave, onDelete }: ToDoRenderProps) {
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