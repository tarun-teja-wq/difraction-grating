const linesInput = document.getElementById("lines");
const orderInput = document.getElementById("order");
const angleInput = document.getElementById("angle");
const result = document.getElementById("result");
const observations = document.getElementById("observations");

const referenceLines = [
  { colour: "Violet", wavelength: 404.7 },
  { colour: "Blue", wavelength: 435.8 },
  { colour: "Green", wavelength: 546.1 },
  { colour: "Yellow", wavelength: 577.0 },
  { colour: "Yellow", wavelength: 579.1 }
];

let records = [];

function calculateWavelength() {
  const linesPerMM = Number(linesInput.value);
  const order = Number(orderInput.value);
  const angle = Number(angleInput.value);

  if (
    !Number.isFinite(linesPerMM) ||
    linesPerMM <= 0 ||
    !Number.isFinite(order) ||
    order < 1 ||
    !Number.isFinite(angle) ||
    angle <= 0 ||
    angle >= 90
  ) {
    result.textContent =
      "Please enter a positive grating density and an angle between 0° and 90°.";
    return;
  }

  // Grating spacing in metres
  const d = 1 / (linesPerMM * 1000);

  // Convert degrees to radians for JavaScript's sine function
  const radians = angle * Math.PI / 180;

  // Diffraction grating equation: nλ = d sin θ
  const wavelengthMetres = (d * Math.sin(radians)) / order;
  const wavelengthNM = wavelengthMetres * 1e9;

  const nearest = referenceLines.reduce((best, line) => {
    return Math.abs(line.wavelength - wavelengthNM) <
      Math.abs(best.wavelength - wavelengthNM)
      ? line
      : best;
  }, referenceLines[0]);

  const difference = Math.abs(nearest.wavelength - wavelengthNM);
  const percentError =
    (difference / nearest.wavelength) * 100;

  result.innerHTML = `
    <strong>Calculated wavelength</strong><br>
    λ = ${wavelengthNM.toFixed(2)} nm<br>
    <strong>Grating spacing:</strong> ${(d * 1e6).toFixed(4)} μm<br>
    <strong>Nearest reference line:</strong>
    ${nearest.colour} (${nearest.wavelength} nm)<br>
    <strong>Difference:</strong> ${difference.toFixed(2)} nm<br>
    <strong>Relative difference:</strong> ${percentError.toFixed(2)}%
  `;

  records.push({
    colour: nearest.colour,
    angle,
    order,
    wavelength: wavelengthNM,
    reference: nearest.wavelength
  });

  renderTable();
}

function renderTable() {
  if (records.length === 0) {
    observations.innerHTML = `
      <tr>
        <td colspan="5">No observations recorded yet.</td>
      </tr>
    `;
    return;
  }

  observations.innerHTML = records.map(record => `
    <tr>
      <td>${record.colour}</td>
      <td>${record.angle.toFixed(2)}°</td>
      <td>${record.order}</td>
      <td>${record.wavelength.toFixed(2)} nm</td>
      <td>${record.reference.toFixed(1)} nm</td>
    </tr>
  `).join("");
}

document.getElementById("calculate").addEventListener(
  "click",
  calculateWavelength
);

document.getElementById("clear").addEventListener("click", () => {
  records = [];
  renderTable();
  result.textContent = "Observations cleared. Enter new measurements.";
});