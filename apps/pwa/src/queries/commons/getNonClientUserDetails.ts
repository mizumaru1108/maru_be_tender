export const getNonClientDetails = `query getNonClientDetails($userId: String!) {  
  user(where: {id: {_eq: $userId}}) {    
    email
    mobileNumber: mobile_number
  }   
}
`;
