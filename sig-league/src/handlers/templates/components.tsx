import * as elements from "typed-html";

export function Panel(children: string) {
  return (
    <div class="max-w-2xl mx-auto bg-white p-8 border border-gray-200 rounded">
      {children}
    </div>
  );
}
