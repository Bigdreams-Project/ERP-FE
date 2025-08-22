export interface ICenter {
  centerName: string;
  location: string;
  centerAddress: string;
  centerManagerName: string;
  contactPhone: string;
  emailAddress: string;
  status: string;
  document: FileList | null;
}

export interface ICenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (centerData: ICenter, isDraft: boolean) => void;
  initialData?: Partial<ICenter>;
  mode: "add" | "edit";
}