export default function FinishedScreen({ points, maxPoints }) {
  return (
    <p className="result">
      You Scored<strong>{points} </strong> out of {maxPoints}
    </p>
  );
}
