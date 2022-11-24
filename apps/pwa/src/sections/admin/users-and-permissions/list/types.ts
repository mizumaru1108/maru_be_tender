export type UsersAndPermissionsInterface = {
  id: string;
  name: string;
  email: string;
  permissions: Array<{ role: string }>;
  activation: string;
};

// {
//   "id": "1b297a8e-2d16-4564-b069-8e1976f35acc",
//   "email": "frisky+moderator@soluvas.com",
//   "name": "Moderator",
//   "activation": "ACTIVE_ACCOUNT",
//   "permissions": [
//     {
//       "role": "MODERATOR",
//     }
//   ]
// },
