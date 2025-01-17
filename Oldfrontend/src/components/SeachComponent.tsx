import { Button, Drawer, DrawerAction, DrawerContent, Skeleton, SkeletonLine, InputIcon, Input } from 'keep-react'
import { MagnifyingGlass } from 'phosphor-react'
import DataList from '../components/DataList';

export const DrawerComponent = () => {
  return (
    <Drawer>
      {/* Permet d 'ouvrir le popup */}
      <DrawerAction asChild>
        <fieldset className="relative max-w-md ">
          <Input placeholder="Rechercher" className="ps-11" />
          <InputIcon>
            <MagnifyingGlass size={19} color="#AFBACA" />
          </InputIcon>
        </fieldset>
      </DrawerAction>
      <DrawerContent position="top" style={{ paddingBottom: '450px'}}> {/* Ajout de padding-top pour descendre le drawer */}
        <DataList />
      </DrawerContent>
    </Drawer>
  )
}


