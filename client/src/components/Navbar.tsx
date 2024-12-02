import { useState } from 'react'
import { IconHome, IconLock, IconChevronDown,
         IconUser, IconAd, Icon } from '@tabler/icons-react'
import { Box, Group, ThemeIcon, UnstyledButton, 
         SimpleGrid, Divider, Text, HoverCard } from '@mantine/core'
import { Link } from "wouter"
import classes from './NavbarNested.module.css'

interface LinksGroupProps {
  icon: Icon;
  label: string;
  description?: string;
  link?: string
  links?: { label: string; link: string }[];
}

const mockdata = [
  { label: 'Home', icon: IconHome, link: '/' },
  { label: 'My space',
    icon: IconUser,
    description: "All about user's logged interest",
    links: [
      { label: 'Presentation', link: '/Presentation' },
      { label: 'Agenda', link: '/Agenda' },
      { label: 'Articles', link: '/Articles' },
      { label: 'Documents', link: '/Documents' },
      ],
    },
  { label: 'Settings',
    icon: IconLock,
    description: "User setting account's concern",
    links: [
      { label: 'Enable 2FA', link: '/My/2FA' },
      { label: 'Change password', link: '/My/ChangePassword' },
      { label: 'Recovery codes', link: '/My/Recovery' },
      { label: 'Account', link: '/My/Account' },
    ],
  },
  { label: 'Contacts', icon: IconAd, link: '/Contacts' },
  { label: 'Administration',
    icon: IconAd,
    description: "Web site Administration concern",
    links: [
      { label: 'Pages', link: '/Admin/Pages' },
    ],
  },
];

const LinksGroup = ({ icon: Icon, label, description, links }: LinksGroupProps) => {
  const hasLinks = Array.isArray(links);
  const items = (hasLinks ? links : []).map((l) => (
    <Link className={classes.link} href={l.link} key={l.label}>{l.label}</Link>
  ))
  return(
    <Group  className={classes.control}>
      <HoverCard  radius="md" shadow="md" withinPortal>
        <HoverCard.Target>
          <Group justify="space-between">
            <Box component="span" mr={15} style={{ paddingLeft: '30px', display: 'flex', alignItems: 'center' }}>
              <ThemeIcon variant="light" size={30}>
                <Icon size={18} />
              </ThemeIcon>
              <Text style={{fontWeight: '500 '}}>{label}</Text>
              <IconChevronDown size={16} />
            </Box>
          </Group>
        </HoverCard.Target>
        <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
          <Group justify="space-between" px="md">
            <Text fw={500}>{description}</Text>
          </Group>
          <Divider my="sm" />
          <SimpleGrid cols={2} spacing={0}>
            {items}
          </SimpleGrid>
        </HoverCard.Dropdown>
      </HoverCard>
    </Group>
  )
}     

const NavbarNested = () => {
  const links = mockdata.map((item) => {
    if (item.link) {
      return (
        <UnstyledButton className={classes.control} key={item.label}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <item.icon size={18} />
            </ThemeIcon>
            <Box ml="md">
              <Link className={classes.linked} href={item.link} key={item.label}>{item.label}</Link>
            </Box>
          </Box>
        </UnstyledButton>
      ) 
    } else { return <LinksGroup {...item} key={item.label} /> }
  });

  return (
    <nav className={classes.navbar}>
      <Group className={classes.logos} >
        <SimpleGrid cols={2} spacing={10} >
            <img src='/images/Golang.png' alt='logo' width={50} height={40} />
            <img src='/images/vite.svg' alt='logo' width={50} height={40} />
            <img src='/images/react.png' alt='logo' width={50} height={40} />
            <img src='/images/typescript.png' alt='logo' width={50} height={40} />
        </SimpleGrid>
      </Group>
      <Group className={classes.linksInner}>{links}</Group>
    </nav>
  );
}

export { NavbarNested }