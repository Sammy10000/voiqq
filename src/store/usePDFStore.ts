import { create } from "zustand";

interface PDFState {
  currentPDF: File | null;
  pdfId: string | null;
  setCurrentPDF: (file: File, id: string) => void;
  clearPDF: () => void;
}

export const usePDFStore = create<PDFState>((set) => ({
  currentPDF: null,
  pdfId: null,
  setCurrentPDF: (file, id) => set({ currentPDF: file, pdfId: id }),
  clearPDF: () => set({ currentPDF: null, pdfId: null }),
}));
