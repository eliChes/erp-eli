import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import BASE_URL from "../assets/global/url";

export default function Roles({ children }){
    const [authrztn, setauthrztn] = useState([]);
    useEffect(() => {

    const accessToken = localStorage.getItem('accessToken');

    if(typeof accessToken === 'string'){
      var decoded = jwtDecode(accessToken);

      axios.get(BASE_URL + '/masterList/viewAuthorization/' + decoded.id)
      .then((res) => {
        // console.log("Res: ",res);
        if(res.status === 200){
          setauthrztn(res.data.userRole.col_authorization);
        }
    })
      .catch((err) => {
        console.error(err);
    });

    }

    // console.log("A: ", authrztn)

  }, []);


  return <>{ children(authrztn) }</>
}
