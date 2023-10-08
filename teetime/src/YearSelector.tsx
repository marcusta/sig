import { useParams } from "react-router-dom";
import { TeeTimeResult, Year } from "./TeeTimeResultTypes";

export type YearSelectorProps = {
  data: TeeTimeResult;
  childRenderer: ({
    data,
    yearParam,
  }: {
    data: Year;
    yearParam?: string;
  }) => React.ReactElement;
};

export function YearSelector({ data, childRenderer }: YearSelectorProps) {
  let { yearParam } = useParams();
  const year = yearParam ? yearParam : "2023";
  const yearData = data.years[year];
  const Child = childRenderer;
  return (
    <div className="App">
      {year && <Child data={yearData} yearParam={year} />}
    </div>
  );
}
