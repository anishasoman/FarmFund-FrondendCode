import { serverURL } from "./serverURL";
import commonAPI from "./commonAPI";


//1 Register User 
export const registerUserAPI = async(reqBody)=>{
    return await commonAPI('POST',`${serverURL}/api/register`,reqBody,{})
}
//2 Login User 
export const loginUserAPI = async(reqBody)=>{
    return await commonAPI('POST',`${serverURL}/api/login`,reqBody,{})
}

//3 google Login User 
export const googleLoginUserAPI = async(reqBody)=>{
    return await commonAPI('POST',`${serverURL}/api/googlelogin`,reqBody,{})
}
// update user
export const updateUserAPI = async (reqBody, reqHeader) => {
  return await commonAPI('PUT', `${serverURL}/api/update-user`, reqBody, reqHeader);
};
// get user
export const getUserAPI = async(reqHeader)=>{
    return await commonAPI('GET',`${serverURL}/api/getUser`,{},reqHeader)
}
//get admin
export const getAdminAPI = async(reqHeader)=>{
    return await commonAPI('GET',`${serverURL}/api/getAdmin`,{},reqHeader)
}
//admin update
export const updateAdminAPI = async (reqBody, reqHeader) => {
  return await commonAPI('PUT', `${serverURL}/api/update-admin`, reqBody, reqHeader);
};
//admin get users
export const getUsersAPI = async(reqHeader)=>{
    return await commonAPI('GET',`${serverURL}/api/getUsers`,{},reqHeader)
}
// admin update farmer 
export const updateFarmerAPI = async (reqHeader,reqBody) => {
  return await commonAPI("PUT",`${serverURL}/api/updateFarmer`,reqBody,reqHeader)
}
// farmer create proposal
export const createProposalAPI = async(reqBody,reqHeader)=>{
    return await commonAPI('POST',`${serverURL}/api/createproposal`,reqBody,reqHeader)
}
//farmer get own proposals
export const getFarmerproposalAPI = async(reqHeader)=>{
    return await commonAPI('GET',`${serverURL}/api/farmer/my-proposals`,{},reqHeader)
}
//farmer update proposal
export const updateLastDateAPI = async (reqBody, reqHeader) => {
  return await commonAPI("PUT",`${serverURL}/api/proposals/last-date`,reqBody,reqHeader);
};
//get latest proposals
export const HomeProposalsAPI = async () => {
  return await commonAPI("GET",`${serverURL}/api/latest`);
};
//get active proposals
export const InvestProposalsAPI = async () => {
  return await commonAPI("GET",`${serverURL}/api/activeproposal`);
};
//get proposal by id
export const proposalByIdAPI = async (id,reqHeader) => {
  return await commonAPI("GET",`${serverURL}/api/proposals/${id}`,{},reqHeader);
};
//checkout ivestment
export const CheckoutAPI = async (proposalId, reqBody, reqHeader) => {
  return await commonAPI("POST",`${serverURL}/api/invest/checkout/${proposalId}`,reqBody,reqHeader);
};
//invest using stripe
export const InvestmentPaymentAPI = async (reqBody, reqHeader) => {
  return await commonAPI("POST",`${serverURL}/api/invest/verify`,reqBody,reqHeader);
};
//get investment of invester
export const getMyInvestmentsAPI = async (page = 1, limit = 4, reqHeader) => {
  return await commonAPI("GET",`${serverURL}/api/invest/my-investments?page=${page}&limit=${limit}`,"",reqHeader );
};
//get all proposals
export const getAllProposalsAPI = async (reqHeader) => {
  return await commonAPI("GET", `${serverURL}/api/all-proposals`,{},reqHeader);
};
//delete inactive users by admin
export const deleteUserAPI = async (id, reqHeader) => {
  return await commonAPI("DELETE",`${serverURL}/api/admin/delete-user/${id}`,{},reqHeader);
};
// post update to proposal
export const postUpdateAPI = async (proposalId, reqBody, reqHeader) => {
  return await commonAPI("POST",`${serverURL}/api/addUpdate/${proposalId}`,reqBody,reqHeader);
};
//post comment to proposal update
export const postCommentAPI = async (proposalId,updateId,reqBody,reqHeader) => {
  return await commonAPI("POST",`${serverURL}/api/comment/${proposalId}/${updateId}`,reqBody,reqHeader);
};
//post review
export const postReviewAPI = async (reqHeader,reqBody) => {
  return await commonAPI("POST",`${serverURL}/api/reviews`,reqBody,reqHeader)
} 
//get review
export const getReviewsAPI = async () => {
  return await commonAPI("GET",`${serverURL}/api/reviews`)
} 
//get pdf data
export const getProposalFullDetailsAPI = async (proposalId,reqHeader) => {
  return await commonAPI("GET",`${serverURL}/api/proposal/${proposalId}/details`,{},reqHeader);
};

