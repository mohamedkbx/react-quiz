import { useEffect } from "react";

export default function Timer({ dispatch, time }) {
  const mins = Math.floor(time / 60);
  const secs = time % 60;
  useEffect(() => {
    const timerId = setInterval(() => {
      dispatch({ type: "tich" });
    }, 1000);

    return () => clearInterval(timerId);
  }, [dispatch]);
  return (
    <div className="timer">
      {mins}:{secs}
    </div>
  );
}
