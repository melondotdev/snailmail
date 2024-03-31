import { useCallback } from 'react'
import { ethos } from 'ethos-connect'
import * as MdIcons from "react-icons/md";

const {
  components: { MenuButton },
} = ethos

const Profile = ({ onClick, setIsPopupOpen }) => {
  
  const editProfile = useCallback(() => {
    setIsPopupOpen(true);
    onClick();
  }, [setIsPopupOpen, onClick])
  
  const children = useCallback(
    (hover) => (
      <>
        <MdIcons.MdPerson>
          <path
            d="M12 9V15M15 12H9M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke={hover ? 'white' : 'black'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </MdIcons.MdPerson>
        Profile
      </>
    ),
    []
  )
  
  return (
    <div className='menu-button'>
      <MenuButton
        className="item-center flex gap-1"
        onClick={editProfile}
        hoverChildren={children(true)}
      >
        {children(false)}
      </MenuButton>
    </div>
  )
}

export default Profile
