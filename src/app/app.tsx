import { RecoilRoot } from 'recoil'
import ToDoList from '../pages/ToDo/ToDoList'

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
