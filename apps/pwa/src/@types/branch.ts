type Nullable<T> = T | null;

type Employee = {
  name: string;
  avatar_url?: Nullable<string>;
}
export type Branches = {
  id: string;
  name: string;
  employee: Employee[];
}

export type BranchesState = {
  isLoading: boolean;
  isLoadingDetail: boolean;
  message: string;
  branches: Branches[];
  branch: Branches | null;
  isError: boolean;
  isSuccess: boolean;
}