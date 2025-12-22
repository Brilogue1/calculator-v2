function num(id) {
  const el = document.getElementById(id);
  const v = parseFloat(el.value);
  return Number.isFinite(v) ? v : 0;
}

function setVal(id, value) {
  const el = document.getElementById(id);
  el.value = Number.isFinite(value) ? value.toFixed(2) : "";
}

function fmtMoney(v) {
  const n = Number.isFinite(v) ? v : 0;
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

// Core calculations (matching workbook intent)
function calc() {
  const annualMaintFee = num("annualMaintFee");
  const maintInflation = num("maintInflation");
  const mortgage = num("mortgage");

  const costOfLiquidation = num("costOfLiquidation");
  const transferFees = num("transferFees");
  const processingFee = num("processingFee");

  const eboc = num("eboc");
  const maintCredit = num("maintCredit"); // optional

  const totalCostOfOwnership = annualMaintFee + maintInflation + mortgage; // E32 = E26+E27+E28
  const grossLiquidationPrice = costOfLiquidation + transferFees + processingFee; // J29 = J26+J27+J28
  const mra = grossLiquidationPrice - eboc - maintCredit; // J32 = J29 - J30 - J31

  document.getElementById("outTCO").innerText = fmtMoney(totalCostOfOwnership);
  document.getElementById("outGross").innerText = fmtMoney(grossLiquidationPrice);
  document.getElementById("outMRA").innerText = fmtMoney(mra);

  return {
    annualMaintFee,
    maintInflation,
    mortgage,
    totalCostOfOwnership,
    costOfLiquidation,
    transferFees,
    processingFee,
    grossLiquidationPrice,
    eboc,
    maintCredit,
    mra
  };
}

// Fill Drop Sheet (editable overrides, no recalc back to calculator)
function fillDropSheet(data) {
  setVal("dsAnnualMaintFee", data.annualMaintFee);
  setVal("dsMaintInflation", data.maintInflation);
  setVal("dsMortgage", data.mortgage);
  setVal("dsTCO", data.totalCostOfOwnership);

  setVal("dsCostOfLiquidation", data.costOfLiquidation);
  setVal("dsTransferFees", data.transferFees);
  setVal("dsProcessingFee", data.processingFee);
  setVal("dsGross", data.grossLiquidationPrice);

  setVal("dsEBOC", data.eboc);
  setVal("dsMaintCredit", data.maintCredit);
  setVal("dsMRA", data.mra);
}

function showDropSheet() {
  const data = calc();
  fillDropSheet(data);

  document.getElementById("calculatorPage").style.display = "none";
  document.getElementById("dropSheetPage").style.display = "block";

  // Scroll to top for mobile
  window.scrollTo({ top: 0, behavior: "instant" });
}

function showCalculator() {
  document.getElementById("dropSheetPage").style.display = "none";
  document.getElementById("calculatorPage").style.display = "block";
  window.scrollTo({ top: 0, behavior: "instant" });
}

function printAll() {
  // Ensure both pages are visible for print.
  // Print CSS already forces both .print-page sections to show during print,
  // but showing them here also helps some mobile browsers render correctly.
  document.getElementById("calculatorPage").style.display = "block";
  document.getElementById("dropSheetPage").style.display = "block";

  window.scrollTo({ top: 0, behavior: "instant" });
  window.print();
}

// Wire events
function wire() {
  const inputs = [
    "annualMaintFee","maintInflation","mortgage",
    "costOfLiquidation","transferFees","processingFee",
    "eboc","maintCredit"
  ];

  inputs.forEach(id => {
    document.getElementById(id).addEventListener("input", calc);
  });

  document.getElementById("btnNext").addEventListener("click", showDropSheet);
  document.getElementById("btnBack").addEventListener("click", showCalculator);

  document.getElementById("btnPrintAllTop").addEventListener("click", printAll);
  document.getElementById("btnPrintAllBottom").addEventListener("click", printAll);

  // Initial calculate
  calc();
}

document.addEventListener("DOMContentLoaded", wire);
