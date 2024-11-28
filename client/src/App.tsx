import { Stack, Theme, Accordion } from '@chakra-ui/react'
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from "@/components/ui/accordion"
import Navbar from './components/Admin/Navbar'
import { ShowPages, FormPage, Page } from './components/Admin/Pages'
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [editPage, setEditPage] = useState(false) // create or edit
  const [page, setPage] = useState({} as Page)

  useEffect(()=>{
    
  }, [editPage, page]) 

  return (
    <Stack gap="5">
      <Theme p="4" appearance="dark" colorPalette="teal">
        <Navbar />
        <AccordionRoot multiple padding="10" gap="5">
          <AccordionItem bg="#9b9890" value="showPages">
            <Accordion.ItemTrigger bg="green" padding="5">
              List Pages
            </Accordion.ItemTrigger>
            <Accordion.ItemContent padding="5">
              <ShowPages editPage={setEditPage} setPage={setPage} />
            </Accordion.ItemContent>
          </AccordionItem>
          <AccordionItem bg="#858080" value="createPages">
            <AccordionItemTrigger bg="green" padding="5">
              {(editPage) ? "Edit the " : "Creating a new "}page
            </AccordionItemTrigger>
            <AccordionItemContent padding="5">
              <FormPage page={page} edit={editPage} setEdit={setEditPage} setPage={setPage}/>
            </AccordionItemContent>
          </AccordionItem>
        </AccordionRoot>
      </Theme>
    </Stack>
  )
}

export default App
