import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSetLoggedIn = (check: boolean) => {
    setLoggedIn(check);
  };

  return (
    <div className="container">
      <Navbar loggedIn={loggedIn} setLoggedIn={handleSetLoggedIn} />
      <main>
        <Outlet context={{loggedIn, setLoggedIn: handleSetLoggedIn}} />
      </main>
    </div>
  );
}

export default App;
