import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function BackButton({
  gotoView,
  backView = "tournamentList",
}: {
  gotoView: (view: string) => void;
  backView?: string;
}) {
  return (
    <button
      className="button is-link is-light"
      onClick={() => gotoView(backView)}
    >
      <FontAwesomeIcon icon={faArrowLeft} />
      &nbsp; Tillbaka
    </button>
  );
}
