// import { createContext, useContext, useEffect, useState } from "react";
// import api from "./axiosInstance";


// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await api.get("/verify-user");
//         if (res.data.success) {
//           setUser(res.data.user);
//         }
//       } catch {
//         setUser(null);
//       }
//     };

//     fetchUser();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
