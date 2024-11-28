import { Stack, Container, Card, Table, Heading, Input, Fieldset, Show, Button, Text } from '@chakra-ui/react'
import { Field } from "@/components/ui/field"
import { DataListItem, DataListRoot } from "@/components/ui/data-list"
import { FormEvent, Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { ObjectId, NilObjectID } from 'bson'

const url = 'http://localhost:4040/api/pages'
interface Page {
  id: ObjectId
  title: string
  description: string
  category: string
  body: string
  enable: boolean
  parent: ObjectId
}

const FetchPages = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pages, setPages] = useState(new Map())

  useEffect(() => {
    let ignore = false
    const fetchPages = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(url, {method: "GET", headers: { "Content-Type":"application/json"}})
        if (ignore) { return }
        const elements: Map<string,string> = await response.json()
        setPages(elements)
      } catch (e) {
        setError(e.message)
        setIsLoading(false)
        console.log(e)
      }
      setIsLoading(false)
    }
    fetchPages()
    return () => { ignore = true }
  }, [])

  if (isLoading) {
    return [null, "Loading..."]
  }
  if (error != null) {
    return [null, error]
  }
  return [pages, "Pages existing"]
}

const convertNullObjectIdToString = (o: ObjectId | NilObjectID) => {
  if (typeof o == "object") { return o.toString() }
  return "___"
}



const ShowPages = (
          { editPage, setPage }: 
          { editPage: React.Dispatch<React.SetStateAction<boolean>>, 
            setPage: React.Dispatch<React.SetStateAction<Page>> }) => {

  let tableRender
  const [cardPage, setCardPage] = useState({} as Page)
  const [pages, heading] = FetchPages()

  const handleRowClick = (e: React.MouseEvent, data: Page) => { 
    e.preventDefault()
    if (!data.description) { data.description = "empty" }
    setCardPage(data)
  }

  const cardEditButton = (e: React.MouseEvent, data: Page) => {
    e.preventDefault()
    editPage(true)
    setPage(data)
  }

  const cardCancelButton = (e: React.MouseEvent) => {
    e.preventDefault()
    editPage(false)
    setCardPage({} as Page)
  }

  if (pages) {
    tableRender = pages.map((page: Page) => {
      if (!page.category) { page.category = "___" }
      return (
        <Table.Row key={page.id.toString()} _hover={{bg: "#158952"}} onClick={((e) => handleRowClick(e, page))}>
          <Table.Cell>{page.id.toString()}</Table.Cell>
          <Table.Cell>{page.title}</Table.Cell>
          <Table.Cell>{page.enable.toString()}</Table.Cell>
          <Table.Cell>{page.category}</Table.Cell>
          <Table.Cell>{convertNullObjectIdToString(page.parent)}</Table.Cell>
        </Table.Row>
      )
    })
  } else { tableRender = <></>}

  return (
    <Container>
      <Heading>{heading}</Heading>
      <Table.Root size="lg" variant="outline" interactive rounded="md">
        <Table.ColumnGroup>
          <Table.Column htmlWidth="35%" />
          <Table.Column htmlWidth="20%" />
          <Table.Column htmlWidth="5%"  />
          <Table.Column htmlWidth="10%" />
          <Table.Column htmlWidth="30%" />
        </Table.ColumnGroup>
        <Table.Header bg="gray">
          <Table.Row fontWeight="bold">
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Title</Table.ColumnHeader>
            <Table.ColumnHeader>Enabled</Table.ColumnHeader>
            <Table.ColumnHeader>Category</Table.ColumnHeader>
            <Table.ColumnHeader>Parent</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body bg="#aaaaaa">
          { tableRender }
        </Table.Body>
        <Table.Caption>list of existing pages</Table.Caption>
      </Table.Root>
      <Show when={(Object.keys(cardPage).length != 0)} fallback={<Text>Select an existing page</Text>}>
        <Card.Root bg="gray">
          <Card.Header>
            <Card.Title>Show selected page</Card.Title>
            <DataListRoot orientation="horizontal">
              <DataListItem label="Title" value={(Object.keys(cardPage).length != 0) ? cardPage.title : ""} />
              <DataListItem label="Enabled" value={(Object.keys(cardPage).length != 0) ? cardPage.enable.toString() : ""} />
            </DataListRoot>
            <Card.Description>{(cardPage) ? cardPage.description : ""}</Card.Description>
          </Card.Header>
          <Card.Body gap="2">{(cardPage) ? cardPage.body : ""}</Card.Body>
          <Card.Footer gap="2">
            <Button onClick={ ((e) => { cardEditButton(e, cardPage) }) }>Edit</Button>
            <Button onClick={ ((e) => { cardCancelButton(e) }) }>Cancel</Button>
          </Card.Footer>
        </Card.Root>
      </Show>
    </Container>
  )
}

const FormPage = ( { page, edit, setEdit, setPage }: 
                   { page: Page, 
                     edit: boolean, 
                     setEdit: Dispatch<SetStateAction<boolean>>,
                     setPage: Dispatch<SetStateAction<Page>>} ) => {

  const { register, handleSubmit, reset, setValue } = useForm<Page>({ defaultValues: {} })

  // At any edit status change, do action on input: populate or reset
  useEffect(() => {
    if (edit) { 
      setValue("title", page.title)
      setValue("description", page.description)
      setValue("body", page.body)
    } else { reset() }
  }, [edit])
  
  // SUBMIT After input as been validated by handleSubmit
  const submitPage: SubmitHandler<Page> = (data, e) => {
    // find [delete | update | cancel | create] submit origin to Action
    const submitOrigin = e.nativeEvent.submitter.name
    switch(submitOrigin) {
    case "update":
      console.log("I'm going to update the page")
      setPage(data)
      break;
    case "delete":
      console.log("I'm going to delete the page")
      alert("are you sure to delete that, bro ?")
      break;
    case "create":
      console.log("I'm going to create the page")
    }
  }

  return (
    <form  onSubmit={handleSubmit(submitPage)} id="formSub">
      <Fieldset.Root>
        <Fieldset.Legend>{(edit) ? "Update Page" : "New Page"}</Fieldset.Legend>
        <Fieldset.HelperText>{(edit) ? "Update the " : "Create a new "} existing page</Fieldset.HelperText>
        <Fieldset.Content>
          <Field label="title"><Input {...register("title", {
                                                      required: 'This is required',
                                                      minLength: { value: 5, 
                                                                   message: 'Minimum length should be 4' }} )} 
                                      id="title" 
                                      placeholder="title" 
                                      type="text"             /></Field>
          <Field label="description">
            <Input {...register("description")}
                   id="description" placeholder="description"
                   type="text" />
          </Field>
          <Field label="body">
            <Input {...register("body")}
                   id="body" placeholder="body"
                   type="text" />
            </Field>
        </Fieldset.Content>
        <ActionOnPage edit={edit} setEdit={setEdit} />
      </Fieldset.Root>
    </form>
  )
}

const ActionOnPage = ({ edit, setEdit }: { edit: boolean, setEdit: Dispatch<SetStateAction<boolean>>}) => {

  const cancelButton = (e) => {
    setEdit(false)
  }

  if (edit) {
    return (
      <>
      <Stack direction="row">
        <Button type="submit" name="update">Update</Button>
        <Button type="submit" name="delete">Delete</Button>
        <Button onClick={cancelButton}>Cancel</Button>
      </Stack>
      </>
    )
  }
  return (
    <>
      <Button type="submit" name="create">Create</Button>
    </>
  )
}

export { ShowPages, FormPage, ActionOnPage }
export type { Page }
