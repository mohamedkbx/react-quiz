import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Questions from "./components/Questions";

const initialState = {
  questions: [],

  // loading,error,ready,active,finished
  status: "loading",
};

function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return { ...state, questions: action.payload, status: action.status };
    case "dataFailed":
      return { ...state, status: "error" };
    case "quizStart":
      return { ...state, status: "active" };
    default:
      throw new Error("unknown action");
  }
}

function App() {
  const [{ questions, status }, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    async function getQuestions() {
      try {
        let response = await fetch("http://localhost:8000/questions");
        //check response
        if (!response.ok) {
          throw new Error("data fetch failed");
        }
        let data = await response.json();
        dispatch({ type: "dataRecieved", payload: data, status: "ready" });
      } catch (error) {
        dispatch({ type: "dataFailed" });
      }
    }
    getQuestions();
  }, []);

  function startGame() {
    dispatch({ type: "quizStart" });
  }
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen questions={questions} startGame={startGame} />}
        {status === "active" && <Questions />}
      </Main>
    </div>
  );
}

export default App;
