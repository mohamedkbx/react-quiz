import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";

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
  return (
    <div className="app">
      <Header />
      <Main>{status === "loading" && <Loader />}</Main>
    </div>
  );
}

export default App;
