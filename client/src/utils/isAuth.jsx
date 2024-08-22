import React from 'react'
import { Outlet ,Navigate} from 'react-router-dom';


const isAuth =()=> {
  const user= null

  return user ? <Outlet/> :<Navigate to="/login"/>
    
  
}

export default isAuth;



