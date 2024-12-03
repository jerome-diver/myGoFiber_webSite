import { Accordion, Container, Title } from '@mantine/core'
import { ShowPages, FormPage, Page } from './Pages'
import { useState, useEffect } from 'react'
import classes from './Admin.module.css'

const getPagesURL = 'http://localhost:4040/api/pages'

const Admin = () => {
  const [editPage, setEditPage] = useState(false) // create or edit
  const [page, setPage] = useState({} as Page)
  const [pages, setPages] = useState<Page[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(()=>{
    const getPages = async () => {
      setIsLoading(true)
      setError("")
      fetch(getPagesURL, {method: "GET"})
        .then(response => response.json())
        .then(data => {
          setPages(data)
          setIsLoading(false)
          console.info("after to set pages is:", pages)
        })
        .catch(e => {
          setError(e.message)
          setIsLoading(false)
        })
    }
    getPages()
  }, []) 

  useEffect(() => {}, [page, editPage])

  return (
    <Container size="xl" className={classes.wrapper}>
      <Title ta="center" className={classes.title}>
        Admin Pages
      </Title>
      <Accordion variant="separated">
        <Accordion.Item className={classes.item} value="showPages">
          <Accordion.Control>List Pages</Accordion.Control>
          <Accordion.Panel>
            <ShowPages editPage={setEditPage} setPage={setPage} pages={pages} error={error} isLoading={isLoading} />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item variant="separated" value="createPages">
          <Accordion.Control>
            {(editPage) ? "Edit the " : "Creating a new "}page
          </Accordion.Control>
          <Accordion.Panel>
            <FormPage page={page} edit={editPage} setEdit={setEditPage} setPage={setPage} pages={pages} />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  )
}

export { Admin }