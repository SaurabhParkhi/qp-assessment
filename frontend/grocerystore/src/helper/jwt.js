import {jwtDecode} from "jwt-decode";

export const getdecodedToken = ((token)=>{
    const decodedToken = jwtDecode(token);
    return decodedToken;
})