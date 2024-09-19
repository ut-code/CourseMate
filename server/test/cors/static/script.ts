const methods = [
  "get",
  "head",
  "post",
  "put",
  "delete",
  "patch",
  "link",
  "unlink",
] as const;

const $ = (id: string) => document.getElementById(id)!;
const _ = (name: string) => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const button = document.createElement("button");
  button.textContent = name.toUpperCase();
  span.textContent = name;

  $("wrapper").appendChild(li);
  li.appendChild(span);
  li.appendChild(button);
  return button;
};

methods.forEach((kind) => {
  const element = _(kind);
  if (!element) {
    throw new Error(`element ${kind} not found`);
  }
  element.onclick = async () => {
    try {
      const res = await fetch(`http://localhost:3000/${kind}`, {
        method: kind.toUpperCase(),
        mode: "cors",
      });
      const text = await res.text();
      console.log("fetched text: ", text);
      assert(text === (kind === "head" ? "" : "DATA SENT FROM SERVER")); // HEAD request doesn't return a body
      element.textContent = "OK";
      element.style.color = "green";
    } catch (err) {
      element.textContent = `FAIL: ${err}`;
      element.style.color = "red";
    }
  };
});

function assert(b: boolean) {
  if (!b) {
    throw new Error("assertion failed");
  }
}
