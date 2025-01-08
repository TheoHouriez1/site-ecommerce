
import { Button, Drawer, DrawerAction, DrawerContent, Skeleton, SkeletonLine,InputIcon,Input } from 'keep-react'
import { MagnifyingGlass  } from 'phosphor-react'

export const DrawerComponent = () => {
  return (
    <Drawer>
      {/* Permet d 'ouvrir le popup */}
      <DrawerAction asChild>
      <fieldset className="relative max-w-md">
                <Input placeholder="Rechercher" className="ps-11" />
                <InputIcon>
                <MagnifyingGlass size={19} color="#AFBACA" />
                </InputIcon>
            </fieldset>
      </DrawerAction>
      <DrawerContent position="top">
        <div className="mx-auto max-w-md space-y-3 px-6 py-8 lg:px-0">
        <fieldset className="relative max-w-md">
                <Input placeholder="Rechercher" className="ps-11" />
                <InputIcon>
                <MagnifyingGlass size={19} color="#AFBACA" />
                </InputIcon>
            </fieldset>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
