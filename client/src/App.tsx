import { Stack, Theme } from '@chakra-ui/react'
import { Link, Route, Switch } from "wouter";
import Navbar from './components/Admin/Navbar'
import { Admin } from "./components/Admin/Admin"
import './App.css'

function App() {

  return (
    <Theme p="4" appearance="dark" colorPalette="teal">
      <Stack gap="5">
      <Navbar/>
      <Link href="/admin">Admin</Link>
      <Switch>
          <Route path="/admin" component={Admin}>Admin</Route>
      </Switch>
      </Stack>
    </Theme>
  )
}

export default App
