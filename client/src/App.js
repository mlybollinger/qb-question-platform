import React from "react";
import "./global.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import SetAdmin from "./pages/setAdmin";
import QuestionWriter from "./pages/questionWriter";
import QuestionEditor from "./pages/questionEditor";
import AllQuestions from "./components/allQuestions";
import Packetizing from "./components/packetizingView";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import Home from "./pages/home";
import SetOverview from "./pages/setOverview";

function NoMatch() {
  return (
    <div style={{ padding: 20 }}>
      <h2>404: Page Not Found</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adip.</p>
    </div>
  );
}

function TournamentLayout() {
  return (
    <div className="flex w-full">
      <Navbar />
      <div className="flex-auto overflow-x-auto py-4 px-8">
        <Routes>
          <Route path="editor" element={<QuestionWriter />} />
          <Route path="editor/:questionId" element={<QuestionEditor />} />
          <Route path="all-questions" element={<AllQuestions />} />
          <Route path="set-admin" element={<SetAdmin />} />
          <Route path="packetizing" element={<Packetizing />} />
          <Route path="set-overview" element={<SetOverview />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Geologica:wght,SHRP@100,0;300,0;400,100;700,0&display=swap');
      </style>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tournament/:tournamentId/*" element={<TournamentLayout />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
