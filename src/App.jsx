import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Questions from "./components/Questions";
import NextButton from "./components/NextButton";

const initialState = {
  questions: [],
  // loading,error,ready,active,finished
  status: "loading",
  //current question
  index: 0,
  //my answer
  answer: null,
  points: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return { ...state, questions: action.payload, status: action.status };
    case "dataFailed":
      return { ...state, status: "error" };
    case "quizStart":
      return { ...state, status: "active" };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: nullfe };
    case "newAnswer": {
      const currentQuestion = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === currentQuestion.correctOption
            ? state.points + currentQuestion.points
            : state.points,
      };
    }
    default:
      throw new Error("unknown action");
  }
}

function App() {
  const [{ questions, status, index, answer }, dispatch] = useReducer(reducer, initialState);
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
        {status === "active" && (
          <>
            <Questions question={questions[index]} dispatch={dispatch} answer={answer} />
            <NextButton answer={answer} dispatch={dispatch} />
          </>
        )}
      </Main>
    </div>
  );
}

export default App;
