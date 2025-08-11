import React, { createContext, useContext, useState } from "react";

type modalType = "writeEntry" | "login" | "register" | "registerLogin" | null

interface ModalContextValue {
    activeModal: modalType,
    openModal: (type: modalType) => void;
    closeModal: () => void;
}

// Creates a context, Initiliaze as undefined as specify its type.
// This context can provide or read
const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export const ModalProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [activeModal,setActiveModal] = useState<modalType>(null)

    const openModal = (type: modalType) => setActiveModal(type)
    const closeModal = () => setActiveModal(null)

    return (
        // This makes the activeModal state and the two function available to all its child components
        // the value prop is where we pass the object that matches the ModalContextValue interface
        <ModalContext.Provider value={{ activeModal, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    )
}

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
};