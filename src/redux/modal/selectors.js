export const selectIsModalOpen = (state) => state.modal.isOpen;
export const selectModal = (state) => state.modal;
export const selectModalType = (state) => state.modal.type;

export const selectModalProps = (state) => state.modal.props;

export const selectBurgerOpen = (state) => state.burger.isOpen;
export const selectLogoutModalIsOpen = (state) => state.logoutModal.isOpen;
export const selectLogoutModalMessage = (state) => state.logoutModal.message;
