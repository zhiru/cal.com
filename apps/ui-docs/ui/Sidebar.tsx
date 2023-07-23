'use client'

import type { PageConf } from '@/config/pages';
import { pages } from '@/config/pages'
import { usePropsPanel } from '@/lib/usePropsPanel';
import Searchbar from '@/ui/Searchbar';
import type { LinkProps} from 'next/link';
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Sidebar() {
  const [search, setSearch] = useState('')
  const pathname = usePathname()
  const { setActiveComponent } = usePropsPanel()

  const filteredPages = search
    ? pages.reduce((acc, section) => {
        const filteredPages = section.pages.filter((page) =>
          page.name.toLowerCase().includes(search.toLowerCase())
        )

        if (filteredPages.length > 0) {
          return acc.concat({
            ...section,
            pages: filteredPages,
          })
        } else {
          return acc
        }
      }, [] as PageConf)
    : pages

  return (
    <div className="overflow-none border-base bg-foreground dark:bg-base fixed top-0 flex h-screen max-h-screen w-60 shrink-0 flex-col gap-6 border-r pr-8 pt-12 text-subtle shadow-inner">
      <div className=" pl-7">
        <Searchbar
          placeholder="Find components"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="dark:bg-foreground"
        />
      </div>

      <div className="flex flex-col gap-8 overflow-auto pb-10 pl-4 pr-0.5">
        <div className="flex flex-col gap-6">
          {filteredPages.map((section) => (
            <div className="flex flex-col gap-3.5" key={section.sectionName}>
              <span className="pl-4 text-sm font-medium text-default">
                {section.sectionName}
              </span>
              <div className="flex flex-col gap-1 text-xs">
                {section.pages.map((page) => (
                  <SidebarLink
                    pagePath={page.path}
                    key={page.path}
                    pathname={pathname}
                    onClick={() => {
                      setSearch('')
                      setActiveComponent({
                        id: '',
                        hasSlots: false,
                      })
                    }}
                  >
                    {page.name}
                  </SidebarLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4 mt-auto self-end">
        <ThemeToggle />
      </div>
    </div>
  )
}

function SidebarLink({
  children,
  pathname,
  pagePath,
  ...rest
}: {
  children: React.ReactNode
  pathname: string
  pagePath: string
} & Omit<LinkProps, 'href'>) {
  return (
    <Link
      {...rest}
      className={classNames(
        'transitions-colors rounded-default ml-0.5 px-4 py-2 text-sm outline-none duration-200 focus:ring-subtle focus-visible:ring-2',
        pathname === pagePath
          ? 'bg-accent text-default'
          : 'text-subtle hover:bg-subtle hover:text-default'
      )}
      href={pagePath}
    >
      {children}
    </Link>
  )
}
