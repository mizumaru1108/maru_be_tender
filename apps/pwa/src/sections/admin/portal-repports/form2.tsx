interface Props {
  children?: React.ReactNode;
  // onSubmitForm: (data: FormValuesPortalReport1) => void;
  isLoading: boolean;
}
export default function PortalReportsForm2({ children, isLoading }: Props) {
  return <div>Testing Form 2{children}</div>;
}
