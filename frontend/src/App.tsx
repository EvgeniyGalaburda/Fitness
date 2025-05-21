import { Navigate, Route, Routes } from "react-router";
import { Register } from "./pages/authorization/Register";
import { Login } from "./pages/authorization/Login";
import { AppRoutes } from "./AppRoutes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import background from "./common_imgs/background.svg";

function App() {
  const { data, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/me", {
          withCredentials: true,
        });
        if (!res) return null;
        return res;
      } catch (error: any) {
        return null;
      }
    },
    retry: false,
    staleTime: Infinity,
  });
  if (isLoading) {
    return <h1>Loading</h1>;
  }
  return (
    <div className="app">
      <img src={background} alt="" />
      <Routes>
        <Route
          path="/*"
          element={data ? <AppRoutes /> : <Navigate to={"/register"} />}
        />
        <Route
          path="/register"
          element={!data ? <Register /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!data ? <Login /> : <Navigate to={"/"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
