export default function StartScreen({ questions, startGame }) {
  return (
    <div className="start">
      <h2>Welcome to React Quiz</h2>
      <h3>{questions.length} Questions to test your React Mastery</h3>
      <button className="btn btn-ui" onClick={startGame}>
        Let&apos;s Start
      </button>
    </div>
  );
}
