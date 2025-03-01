export interface ModalContent {
  title: string;
  message: string;
  action: (() => void) | null;
}