import { useAuthContext } from "../context/useAuthContext";



function Home() {
  const { logout } = useAuthContext();

  return( <><h1>Home Page</h1>;

  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4" onClick={logout}>Logout</button>
 </> )
}

export default Home;   