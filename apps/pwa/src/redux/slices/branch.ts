import { createSlice } from '@reduxjs/toolkit';
import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';
// utils
import axios from '../../utils/axios';
import { BranchesState, Branches } from '../../@types/branch';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState: BranchesState = {
  isLoading: false,
  message: '',
  branches: [],
  branch: null,
  isError: false,
  isSuccess: false,
  isLoadingDetail: false,
};

const slice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    startLoadingDetail(state) {
      state.isLoadingDetail = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.message = action.payload;
      state.isError = true;
    },

    // GET BRANCHES
    getBranchesSuccess(state, action) {
      state.isLoading = false;
      state.branches = action.payload;
    },

    // GET BRANCH
    getBranchSuccess(state, action) {
      state.isLoadingDetail = false;
      state.branch = action.payload;
    },

    deleteBranchSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
      state.message = `${action.payload.length} branch${action.payload.length > 1 ? 'es' : ''} successfully deleted`;
    },

    resetState(state) {
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.isLoadingDetail = false;
    }
  },
});

// Reducer
export default slice.reducer;

// Actions
// export const {
// } = slice.actions;

// ----------------------------------------------------------------------

type DummyBranches = {
  data: {
    branches: Branches[]
  };
}
type DummyDetailBranch = {
  data: {
    branch: Branches
  };
}
type DummyResponse = {
  data: Object;
  meta: {
    success: boolean;
    message: string;
  }
}
let dummy: DummyBranches = {
  data: {
    branches: [
      {
        id: 'BR-0001',
        name: 'Dompet Duafa Bandung',
        employee: [
          {
            name: 'Reyhan Fikran',
            avatar_url:
              'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg',
          },
          {
            name: 'Reyhan Fikran',
            avatar_url: null,
          },
          {
            name: 'Jane Doe',
            avatar_url:
              'https://img2.pngdownload.id/20180423/stq/kisspng-computer-icons-avatar-icon-design-male-teacher-5ade176c2f4525.7023913115245044281936.jpg',
          },
        ],
      },
      {
        id: 'BR-0002',
        name: 'Dompet Duafa Semarang',
        employee: [
          {
            name: 'Reyhan Fikran',
            avatar_url:
              'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg',
          },
          {
            name: 'Justin Bieber',
            avatar_url: null,
          },
          {
            name: 'Jane Doe',
            avatar_url:
              'https://img2.pngdownload.id/20180423/stq/kisspng-computer-icons-avatar-icon-design-male-teacher-5ade176c2f4525.7023913115245044281936.jpg',
          },
        ],
      },
      {
        id: 'BR-0003',
        name: 'Dompet Duafa Kuningan',
        employee: [
          {
            name: 'Reyhan Fikran',
            avatar_url:
              'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg',
          },
          {
            name: 'James Bond',
            avatar_url: null,
          },
          {
            name: 'Jane Doe',
            avatar_url:
              'https://img2.pngdownload.id/20180423/stq/kisspng-computer-icons-avatar-icon-design-male-teacher-5ade176c2f4525.7023913115245044281936.jpg',
          },
        ],
      },
      {
        id: 'BR-0004',
        name: 'Dompet Duafa Yogyakarta',
        employee: [
          {
            name: 'Reyhan Fikran',
            avatar_url:
              'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg',
          },
          {
            name: 'Bruce Lee',
            avatar_url: null,
          },
          {
            name: 'Jane Doe',
            avatar_url:
              'https://img2.pngdownload.id/20180423/stq/kisspng-computer-icons-avatar-icon-design-male-teacher-5ade176c2f4525.7023913115245044281936.jpg',
          },
        ],
      },
      {
        id: 'BR-0005',
        name: 'Dompet Duafa Solo',
        employee: [
          {
            name: 'Reyhan Fikran',
            avatar_url:
              'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg',
          },
          {
            name: 'Stephen Chou',
            avatar_url: null,
          },
          {
            name: 'Jane Doe',
            avatar_url:
              'https://img2.pngdownload.id/20180423/stq/kisspng-computer-icons-avatar-icon-design-male-teacher-5ade176c2f4525.7023913115245044281936.jpg',
          },
        ],
      },
      {
        id: 'BR-0006',
        name: 'Dompet Duafa Papua',
        employee: [
          {
            name: 'Reyhan Fikran',
            avatar_url:
              'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg',
          },
          {
            name: 'Jhonathan',
            avatar_url: null,
          },
          {
            name: 'Jane Doe',
            avatar_url:
              'https://img2.pngdownload.id/20180423/stq/kisspng-computer-icons-avatar-icon-design-male-teacher-5ade176c2f4525.7023913115245044281936.jpg',
          },
        ],
      },
      {
        id: 'BR-0007',
        name: 'Dompet Duafa Jakarta',
        employee: [
          {
            name: 'Reyhan Fikran',
            avatar_url:
              'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg',
          },
          {
            name: 'Asep Samsudin',
            avatar_url: null,
          },
          {
            name: 'Jane Doe',
            avatar_url:
              'https://img2.pngdownload.id/20180423/stq/kisspng-computer-icons-avatar-icon-design-male-teacher-5ade176c2f4525.7023913115245044281936.jpg',
          },
          {
            name: 'Lord Dustin',
            avatar_url:
              'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg',
          },
          {
            name: 'Huskar',
            avatar_url: null,
          },
          {
            name: 'Jane Doe 2',
            avatar_url:
              'https://img2.pngdownload.id/20180423/stq/kisspng-computer-icons-avatar-icon-design-male-teacher-5ade176c2f4525.7023913115245044281936.jpg',
          },
        ],
      },
      {
        id: 'BR-0008',
        name: 'Dompet Duafa Bogor',
        employee: [
          {
            name: 'Reyhan Fikran',
            avatar_url:
              'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg',
          },
          {
            name: 'Agus Dragon',
            avatar_url: null,
          },
          {
            name: 'Jane Doe',
            avatar_url:
              'https://img2.pngdownload.id/20180423/stq/kisspng-computer-icons-avatar-icon-design-male-teacher-5ade176c2f4525.7023913115245044281936.jpg',
          },
        ],
      },
    ],
  },
};
const dummyBranches = () =>
  new Promise<DummyBranches>((resolve, reject) => {
    setTimeout(() => resolve(dummy), 3000);
  });

const dummyDetailBranch = (id: string) => {
  const find = dummy.data.branches.find(x => x.id === id) as Branches;
  return new Promise<DummyDetailBranch>((resolve, reject) => {
    setTimeout(() => resolve({
      data: {
        branch: find
      }
    }), 3000);
  })
};

const deleteDummyBranch = (ids: string[]) => {
  dummy.data.branches = dummy.data.branches.filter(x => !ids.includes(x.id));
  return new Promise<DummyResponse>((resolve, reject) => {
    setTimeout(() => resolve({
      data: {},
      meta: {
        success: true,
        message: 'Success'
      }
    }), 500);
  });
}

export function getBranches() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response: { data: { branches: Branches[] } } = await dummyBranches();
      dispatch(slice.actions.getBranchesSuccess(response.data.branches));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getBranch(id: string) {
  return async () => {
    dispatch(slice.actions.startLoadingDetail());
    try {
      const response: { data: { branch: Branches } } = await dummyDetailBranch(id);
      dispatch(slice.actions.getBranchSuccess(response.data.branch));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteBranch(ids: string[]) {
  return async () => {
    try {
      const { meta } = await deleteDummyBranch(ids);
      if (meta.success) {
        dispatch(slice.actions.deleteBranchSuccess(ids));
        setTimeout(() => dispatch(getBranches()), 500);
      }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function resetState() {
  return () => {
    dispatch(slice.actions.resetState());
  }
}
