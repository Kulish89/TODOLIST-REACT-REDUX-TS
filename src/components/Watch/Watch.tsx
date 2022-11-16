import { useEffect, useState } from "react";

export const Watch = () => {
  const [date, setDate] = useState<Date>(new Date());
  useEffect(() => {
    let intervalId = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  const getTime = (number: number): string | number =>
    number < 10 ? "0" + number : number;
  return (
    <div className="watch_container">
      <span>{getTime(date.getHours())}</span>:
      <span>{getTime(date.getMinutes())}</span>:
      <span>{getTime(date.getSeconds())}</span>
    </div>
  );
};
