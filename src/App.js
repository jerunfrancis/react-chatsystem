import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user1" element={<Chat user="user1" to="user2" />} />
        <Route path="/user2" element={<Chat user="user2" to="user1" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

