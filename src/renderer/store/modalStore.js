import { create } from 'zustand';

export const useModalStore = create((set) => ({
    // Estado
    activeModal: null,
    modalProps: {},

    // Actions
    openModal: (modalType, props = {}) => {
        set({
            activeModal: modalType,
            modalProps: props
        });
    },

    closeModal: () => {
        set({
            activeModal: null,
            modalProps: {}
        });
    },

    updateModalProps: (props) => {
        set((state) => ({
            modalProps: { ...state.modalProps, ...props }
        }));
    }
}));

// Tipos de modais disponíveis
export const MODAL_TYPES = {
    UNLOCK_NOTE: 'UNLOCK_NOTE',
    SET_PASSWORD: 'SET_PASSWORD',
    CONFIRM: 'CONFIRM'
};