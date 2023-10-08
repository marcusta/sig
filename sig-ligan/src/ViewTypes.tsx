import { Tournament } from "./TournamentDataTypes";

export type ViewType = ({
  data,
  gotoView,
  params,
}: ViewTypeParams) => JSX.Element;

export type ViewTypeParams = {
  data: Tournament[];
  gotoView: (view: string, params?: string[]) => void;
  params?: string[];
};
