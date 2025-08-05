import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

// manages authentication globally
const useAuth = () => useContext(AuthContext);

export default useAuth;
