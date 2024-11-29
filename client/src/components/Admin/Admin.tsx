import { Accordion } from '@chakra-ui/react'
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from "@/components/ui/accordion"
import { ShowPages, FormPage, Page } from './Pages'
import { useState, useEffect } from 'react'

const Admin = () => {
  const [editPage, setEditPage] = useState(false) // create or edit
  const [page, setPage] = useState({} as Page)

  useEffect(()=>{
    
  }, [editPage, page]) 

  return (
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
  )
}

export { Admin }