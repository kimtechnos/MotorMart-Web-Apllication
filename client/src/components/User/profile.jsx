import React,{useState} from 'react'
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/dark.css";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";
import { apiBase } from '../../utils/config';


const profile = () => {
  const storedData = JSON.parse(localStorage.getItem("motarmart-user"));
  const user = storedData?.state?.user;
  const [userData, setUserData] = useState(user || {});
  const [password ,setpassword]= useState('');

  const handlePasswordChange = (e) =>{
    setpassword(e.target.value);

  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData={
        ...userData,
        ...(password && {password}),
      }
      

      const response = await fetch(`${apiBase}/api/users/update/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(updateData),
        credentials: "include",
      });
      console.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        toast("Profile updated successfully!", { theme: "success" });
      } else {
        toast("Failed to update profile:", { theme: "failure" });
      }
    } catch (error) {
      console.error("Error updating profile", error);
      toast("Error occurred while updating the profile", { theme: "failure" });
    }
     
  };
  
 

  return (
    <div className='profile-container'>
      <h1>
        {user && <div className="user-welcome-profile"> {user.fullName}: Profile</div>}
      </h1>
      <form className='form-section' onSubmit={handleSubmit}>
        <label>
          Fullname:
          <input
            type="text"
            name="fullName"
            value={userData.fullName || ""}
            onChange={handleChange}
          />
        </label>
       
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={userData.email || ""}
            onChange={handleChange}
          />
        </label>
       
        <label>
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={userData.phoneNumber || ""}
            onChange={handleChange}
          />
        </label>
      
        <label>
          update password:
          <input
            type="password"
            name="password"
            value={password || ''}
            onChange={handlePasswordChange}
          />
        </label>
       
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};


export default profile;
