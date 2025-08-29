import { useSelector } from 'react-redux';
import {
  selectModalType,
  selectIsModalOpen,
} from '../../redux/modal/selectors.js';
import ModalReUse from '../ModalReUse/ModalReUse.jsx';
import ModalNotAuthorized from '../ModalNotAuthorized/ModalNotAuthorized.jsx';
import ModalLogoutConfirm from '../ModalLogoutConfirm/ModalLogoutConfirm.jsx';
import ModalRecipeSaved from '../ModalRecipeSaved/ModalRecipeSaved.jsx';
import ModalErrorSaving from '../ModalErrorSaving/ModalErrorSaving.jsx';
import ModalConfirmDelete from '../ModalConfirmDelete/ModalConfirmDelete.jsx';

export default function ReModalContainer() {
  const isOpen = useSelector(selectIsModalOpen);
  const type = useSelector(selectModalType);

  if (!isOpen) return null;

  return (
    <ModalReUse>
      {type === 'notAuthorized' && <ModalNotAuthorized />}
      {type === 'logoutConfirm' && <ModalLogoutConfirm />}
      {type === 'recipeSaved' && <ModalRecipeSaved />}
      {type === 'errorSaving' && <ModalErrorSaving />}
      {type === 'confirmDelete' && <ModalConfirmDelete />}
    </ModalReUse>
  );
}
