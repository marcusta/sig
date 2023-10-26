import * as elements from "typed-html";
import { TeeBox } from "../../../../models";

export function TeeBoxSelector({ teeboxes }: { teeboxes: TeeBox[] }) {
  return (
    <div>
      <label
        for="courseSelector"
        class="block text-sm font-medium text-gray-700 mb-1"
      >
        Select teebox:
      </label>
      <select
        id="teeboxId"
        name="teeboxId"
        class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
      >
        {teeboxes.map((teebox) => (
          <option value={teebox.TeeBoxID.toString()}>
            {teebox.TeeBoxName}
          </option>
        ))}
      </select>
    </div>
  );
}
