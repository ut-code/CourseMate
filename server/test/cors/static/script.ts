const $ = (id: string) => document.getElementById(id);

const kinds = ["get", "post", "put", "delete"];
kinds.forEach((kind) => {
  const element = $(kind);
  if (!element) {
    throw new Error(`element ${kind} not found`);
  }
  element.onclick = async () => {
    try {
      const res = await fetch(`http://localhost:3000/${kind}`, {
        method: kind,
        mode: "cors",
      });
      const text = await res.text();
      console.log(`fetched text: `, text);
      assert(text === "DATA SENT FROM SERVER");
      element.textContent = "OK";
      element.style.color = "green";
    } catch (err){
      element.textContent = "FAIL: "+err;
      element.style.color = "red";
    }
  }
});

function assert(b: boolean) {
  if (!b) {
    throw new Error("assertion failed");
  }
}
