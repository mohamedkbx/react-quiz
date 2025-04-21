export default function FinishedScreen({ points, maxPoints, highscore, dispatch }) {
  let emoji;
  if (points === maxPoints) emoji = "🥇";
  if (points < 280 && points >= 200) emoji = "🥈";
  if (points < 200 && points >= 100) emoji = "🥉";
  if (points < 100 && points >= 50) emoji = "🎉";
  if (points < 50) emoji = "🤦🏻‍♂️";

  return (
    <>
      <p className="result">
        <span>{emoji}</span> You Scored <strong>{points} </strong> out of {maxPoints}
      </p>
      <p className="highscore">Highscore: {highscore} Points</p>
      <button className="btn btn-ui" onClick={() => dispatch({ type: "restart" })}>
        Restart Quiz
      </button>
    </>
  );
}
