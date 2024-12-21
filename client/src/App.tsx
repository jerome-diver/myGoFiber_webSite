import { Container, SimpleGrid, Grid } from '@mantine/core'
import { Route, Switch } from "wouter";
import { NavbarNested } from './components/Navbar'
import { Admin } from "./components/Admin/Admin"
import Loading from "./components/Loading"
import { MantineProvider } from '@mantine/core'
import classes from './App.module.css'
import '@mantine/core/styles.css'
import { Suspense } from 'react'


function App() {

  return (
    <MantineProvider forceColorScheme="dark" theme={{
      primaryColor: "blue",
      colors: {
        asphalt: ['#F0F4F5', '#D4E0E2', '#B9CCD0', '#9EB8BD', 
                  '#82A4AB', '#679098', '#52747A', '#3E575B', 
                  '#293A3D', '#151D1E']
      },
    }} >
      <header className={classes.header}>
        <NavbarNested/>
      </header>
      <Container my="md">
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <Grid gutter="md">
            <Suspense fallback={<Loading />}>
              <Switch>
                <Route path="/admin/pages" component={Admin}>Admin</Route>
              </Switch>
            </Suspense>
          </Grid>
        </SimpleGrid>
      </Container>
    </MantineProvider>
  )
}

export default App
