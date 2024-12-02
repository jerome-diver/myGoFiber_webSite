import { Container, Title, Anchor, Group, Button, Switch,
         Center, ScrollArea, Table, Card, Stack, keys, Textarea,
         Text, TextInput, UnstyledButton } from '@mantine/core'
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector } from '@tabler/icons-react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { ObjectId } from 'bson'
import cx from 'clsx';
import classes from './Pages.module.css'

const getPagesURL = 'http://localhost:4040/api/pages'
interface Page {
  id: ObjectId
  title: string
  description: string
  category: string
  body: string
  enable: boolean
  parent: ObjectId
}

interface ThProps {
  children: React.ReactNode
  reversed: boolean
  sorted: boolean
  onSort: () => void
}

const filterData = (data: Page[], search: string) => {
  const query = search.toLowerCase().trim()
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toString().toLowerCase().includes(query))
  )
}

const sortData = ( data: Page[],
                   payload: { sortBy: keyof Page | null; 
                              reversed: boolean; 
                              search: string } ) => {
  const { sortBy } = payload

  if (!sortBy) {
    return filterData(data, payload.search)
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].toString().localeCompare(a[sortBy].toString())
      }
      return a[sortBy].toString().localeCompare(b[sortBy].toString())
    }),
    payload.search
  )
}

const convertNullObjectIdToString = (o: ObjectId) => {
  if (typeof o == "object") { return o.toString() }
  return "___"
}

const Th = ({ children, reversed, sorted, onSort }: ThProps) => {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  )
}

const TableRowForPage = ({page, setCardPage }: {page: Page, setCardPage: Dispatch<SetStateAction<Page>>}) => {

  const handleRowClick = (e: React.MouseEvent, data: Page) => { 
    e.preventDefault()
    if (!data.description) { data.description = "empty" }
    setCardPage(data)
  }

  console.info("row page:", page)

  if (page.id) {
    if (!page.category) { page.category = "___" }
    return (
      <Table.Tr key={page.id.toString()} onClick={((e) => handleRowClick(e, page))}>
        <Table.Td>
          <Anchor component="button" fz="sm">{page.id.toString()}</Anchor>
          </Table.Td>
        <Table.Td>{page.title}</Table.Td>
        <Table.Td>{page.enable.toString()}</Table.Td>
        <Table.Td>{page.category}</Table.Td>
        <Table.Td>{convertNullObjectIdToString(page.parent)}</Table.Td>
      </Table.Tr>
    )
  }
}

const ShowPages = (
          { editPage, setPage }: 
          { editPage: Dispatch<SetStateAction<boolean>>, 
            setPage: Dispatch<SetStateAction<Page>> }) => {

  const [cardPage, setCardPage] = useState({} as Page)
  //const [pages, heading] = FetchPages()
  const [search, setSearch] = useState('')
  const [sortedPages, setSortedPages] = useState<Page[]>([])
  const [sortBy, setSortBy] = useState<keyof Page | null>(null)
  const [reverseSortDirection, setReverseSortDirection] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [pages, setPages] = useState<Page[]>([])
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
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

  const setSorting = (field: keyof Page) => {
    const reversed = field === sortBy ? !reverseSortDirection : false
    setReverseSortDirection(reversed)
    setSortBy(field)
    setSortedPages(sortData(pages, { sortBy: field, reversed, search }))
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    setSearch(value)
    setSortedPages(sortData(pages, { sortBy, reversed: reverseSortDirection, search: value }))
  };

  if (error == "") {
    return (
      <Container>
        <Title>{(isLoading) ? "Loading..." : "Existing pages"}</Title>
        <TextInput
          placeholder="Search by any field"
          mb="md"
          leftSection={<IconSearch size={16} stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
        />
        <ScrollArea h={300} onScrollPositionChange={({y}) => setScrolled(y !== 0)} >
          <Table horizontalSpacing="xl" verticalSpacing="md" miw={700}>
            <Table.Caption>list of existing pages</Table.Caption>
            <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })} >
              <Table.Tr>
                <Th sorted={sortBy === 'id'} 
                    reversed={reverseSortDirection} 
                    onSort={() => setSorting('id')}>ID</Th>
                <Th sorted={sortBy === 'title'} 
                    reversed={reverseSortDirection} 
                    onSort={() => setSorting('title')}>Title</Th>
                <Th sorted={sortBy === 'enable'}
                    reversed={reverseSortDirection} 
                    onSort={() => setSorting('enable')}>Enabled</Th>
                <Th sorted={sortBy === 'category'} 
                    reversed={reverseSortDirection} 
                    onSort={() => setSorting('category')}>Category</Th>
                <Th sorted={sortBy === 'parent'} 
                    reversed={reverseSortDirection} 
                    onSort={() => setSorting('id')}>Parent</Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              { (pages && pages.length != 0)
                  ? sortedPages.map((page: Page) => <TableRowForPage page={page} setCardPage={setCardPage}/>)
                  : <></> }
            </Table.Tbody>
          </Table>
        </ScrollArea>
        <ShowPage page={cardPage} editPage={editPage} setPage={setPage} setCardPage={setCardPage} />
      </Container>
    )
  } else { return <Container><Title>{error}</Title></Container>}
}

const ShowPage = ({ page, editPage, setPage, setCardPage }: 
                  { page: Page,
                    editPage: Dispatch<SetStateAction<boolean>>, 
                    setPage: Dispatch<SetStateAction<Page>>,
                    setCardPage: Dispatch<SetStateAction<Page>> }) => {

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

  if (Object.keys(page).length != 0) {
    return (
          <Card withBorder radius="md" shadow="md" className={classes.card} padding="md">
            <Card.Section>
              <Text>Show selected page</Text>
              <Text id="Title">{page.title}</Text>
              <Text id="Enabled">{page.enable.toString()}</Text>
              <Text id="Description">{page.description}</Text>
              <Text id="Body">{page.body}</Text>
            </Card.Section>
            <Card.Section>
              <Button onClick={ ((e) => { cardEditButton(e, page) }) } color="teal" >Edit</Button> 
              <Button onClick={ ((e) => { cardCancelButton(e) }) } color="black">Cancel</Button>
            </Card.Section>
          </Card>
    )
  } else { return <Text>Select an existing page</Text> }

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
      setValue("enable", page.enable )
    } else { 
      reset()
     }
  }, [edit])
  
  // SUBMIT After input as been validated by handleSubmit
  const submitPage: SubmitHandler<Page> = (data, e) => {
    // find [delete | update | cancel | create] submit origin to Action
    const submitOrigin = e.nativeEvent.submitter.name
    switch(submitOrigin) {
    case "update":
      console.log("I'm going to update the page")
      console.log(data)
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
      <Container>
        <Title>{(edit) ? "Update Page" : "New Page"}</Title>
        <Text>{(edit) ? "Update the " : "Create a new "} existing page</Text>
        <Stack>
          <TextInput {...register("title", 
                                  { required: 'This is required',
                                    minLength: { value: 5, 
                                                 message: 'Minimum length should be 4' }} )} 
                     label="Title" />
          <TextInput {...register("description")}
                     label="Description" />
          <Textarea {...register("body")}
                     label="Body" required />
          <Switch {...register("enable")} checked={(edit) ? page.enable : false}
                  onLabel="Enabled" offLabel="Disabled" />
        </Stack>
        <ActionOnPage edit={edit} setEdit={setEdit} />
      </Container>
    </form>
  )
}

const ActionOnPage = ({ edit, setEdit }: { edit: boolean, setEdit: Dispatch<SetStateAction<boolean>>}) => {

  const cancelButton = () => {
    setEdit(false)
  }

  if (edit) {
    return (
      <>
      <Stack color="asphalt">
        <Button type="submit" name="update" color="teal">Update</Button>
        <Button type="submit" name="delete" color="red">Delete</Button>
        <Button onClick={cancelButton} color="black">Cancel</Button>
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
