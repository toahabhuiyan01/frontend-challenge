import { RecoilRoot } from 'recoil'
import ToDoList from './ToDo'

export function App() {
  return (
    <RecoilRoot>
        <div className='flex w-full h-lvh justify-center items-center'>
            <ToDoList />
        </div>
    </RecoilRoot>
  )
}

export default App
