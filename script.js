function v(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

function money(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function calculate() {
  const tco = v("annualMF") + v("mfInflation") + v("mortgage");
  const gross = v("liquidation") + v("transferFees") + v("processingFee");
  const mra = gross - v("eboc");

  document.getElementById("outTCO").innerText = money(tco);
  document.getElementById("outGross").innerText = money(gross);
  document.getElementById("outMRA").innerText = money(mra);

  return { tco, gross, mra };
}

document.querySelectorAll("input").forEach(i =>
  i.addEventListener("input", calculate)
);

function printMF() {
  const data = calculate();
  document.getElementById("mf1").dataset.active = "true";
  document.getElementById("mfTCO").innerText = money(data.tco);
  document.getElementById("mfGross").innerText = money(data.gross);
  document.getElementById("mfMRA").innerText = money(data.mra);
  window.print();
}

function showDropSheet() {
  const data = calculate();
  document.getElementById("dropSheet").dataset.active = "true";
  document.getElementById("dsMRA").value = data.mra.toFixed(2);
  document.getElementById("dsTCO").value = data.tco.toFixed(2);
  window.scrollTo(0, document.body.scrollHeight);
}

function printDrop() {
  window.print();
}

function startNew() {
  if (!confirm("Start a new calculation?")) return;
  document.querySelectorAll("input").forEach(i => i.value = "");
  document.querySelectorAll(".print-page").forEach(p => p.dataset.active = "false");
  window.scrollTo(0, 0);
}
