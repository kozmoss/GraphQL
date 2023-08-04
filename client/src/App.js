import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import EventDetail from "./Pages/EventDetailPage";
import Page404 from "./Pages/Page404";
import NewEvent from "./Pages/NewEvent";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="event">
        <Route path=":id" element={<EventDetail />} />
      </Route>
      <Route path="/addevent" element={<NewEvent />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default App;
