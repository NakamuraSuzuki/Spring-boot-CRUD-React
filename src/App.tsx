import { Navigate, Route, Routes } from "react-router-dom"
// Components
import { AddUser } from "./components/AddUser"
import { User } from "./components/User"
import { UsersList } from './components/UserList';

export const App = () => {
  return (
    <>
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<UsersList />} />
          <Route path="/add" element={<AddUser />} />
          <Route path="/:id" element={<User />} />
          <Route path='/*' element={<Navigate to='/' replace />} />
        </Routes>
      </div>
    </>
  )
}
