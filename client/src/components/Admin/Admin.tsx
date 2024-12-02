import { Accordion, Container, Title } from '@mantine/core'
import { ShowPages, FormPage, Page } from './Pages'
import { useState, useEffect } from 'react'
import classes from './Admin.module.css'

const Admin = () => {
  const [editPage, setEditPage] = useState(false) // create or edit
  const [page, setPage] = useState({} as Page)

  useEffect(()=>{
    
  }, [editPage, page]) 

  return (
    <Container size="xl" className={classes.wrapper}>
      <Title ta="center" className={classes.title}>
        Admin Pages
      </Title>
      <Accordion variant="separated">
        <Accordion.Item className={classes.item} value="showPages">
          <Accordion.Control>List Pages</Accordion.Control>
          <Accordion.Panel>
            <ShowPages editPage={setEditPage} setPage={setPage} />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item variant="separated" value="createPages">
          <Accordion.Control>
            {(editPage) ? "Edit the " : "Creating a new "}page
          </Accordion.Control>
          <Accordion.Panel>
            <FormPage page={page} edit={editPage} setEdit={setEditPage} setPage={setPage}/>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  )
}

export { Admin }