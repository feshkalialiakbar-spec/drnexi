import { create } from 'zustand'

interface IClerkShowDeleteBtn {
    showDeleteButtons: boolean;
    setShowDeleteButtons: (value: boolean) => void;
}
export const useClerkShowDeleteBtn = create<IClerkShowDeleteBtn>((set) => ({
    showDeleteButtons: false,
    setShowDeleteButtons: (value: boolean) => set(() => ({
        showDeleteButtons: value
    })),
}))