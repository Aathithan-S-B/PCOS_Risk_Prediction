import React, { useState } from "react";
import "./Predict.css";

const Predict = () => {
  const [formData, setFormData] = useState({
    age: "",
    marriageStatus: "", 
    weight: "",
    bmi: "",
    cycleLength: "",
    regularCycle: "", 
    skinDarkening: "",
    hairGrowth: "",
    weightGain: "",
    fastFood: "non",
    pimples: "non",
  });

  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const convertLifestyleToFloat = (value) => {
    switch (value) {
      case "non":
        return 0.0;
      case "mild":
        return 0.5;
      case "heavy":
        return 1.0;
      case "severe":
        return 1.5;
      default:
        return 0.0;
    }
  };

  const convertHairGrowthToFloat = (value) => {
    return value === "Yes" ? 1.0 : 0.0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResponse(null);

    let validationErrors = [];
    let missingFields = [];
    
    for (const key in formData) {
      if (formData[key] === "") {
        missingFields.push(key);
      }
      const numValue = parseFloat(formData[key]);
      if (
        ["age", "weight", "bmi", "cycleLength", "weightGain", "skinDarkening"].includes(key)
      ) {
        if (isNaN(numValue) || numValue < 0) {
          validationErrors.push(`${key} must be a valid non-negative number.`);
        }
      }
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join(" "));
      setIsLoading(false);
      return;
    }

    if (missingFields.length > 0) {
      setError(`Please fill all required fields`);
      setIsLoading(false);
      return;
    }

    const dataToSend = {
      age: formData.age ? parseFloat(formData.age).toFixed(1) : 0.0, 
      marriageStatus: formData.marriageStatus === "Yes" ? 1.0 : 0.0,
      weight: parseFloat(formData.weight).toFixed(1), 
      bmi: parseFloat(formData.bmi).toFixed(1), 
      follicleNoR: parseFloat(9.0).toFixed(1), 
      follicleNoL: parseFloat(8.0).toFixed(1),
      amh: parseFloat(2.5).toFixed(1),
      regularCycle: formData.regularCycle === "Yes" ? 1.0 : 0.0,
      cycleLength: parseFloat(formData.cycleLength).toFixed(1), 
      skinDarkening: parseFloat(formData.skinDarkening).toFixed(1), 
      hairGrowth: convertHairGrowthToFloat(formData.hairGrowth),
      weightGain: parseFloat(formData.weightGain).toFixed(1), 
      fastFood: convertLifestyleToFloat(formData.fastFood),
      pimples: convertLifestyleToFloat(formData.pimples),
    };

    try {
      const response = await fetch("https://pcos-prediction-backend.onrender.com/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      const result = await response.json();

      if (result.atRisk) {
        setResponse({ atRisk: true, message: "The patient is at risk of PCOS" });
      } else {
        setResponse({ atRisk: false, message: "The patient is not at risk of PCOS" });
      }

      setError("");
    } catch (err) {
      setError("Failed to submit the data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="predict-container">
      <div className="predict-wrapper">
        {/* Header */}
        <div className="predict-header">
          <h1 className="predict-title">PCOS Risk Prediction</h1>
          <p className="predict-subtitle">#positivelyunashamed</p>
          <div className="predict-divider"></div>
        </div>

        {/* Form Card */}
        <div className="predict-card">
          <div className="predict-form">
            {/* Form Grid */}
            <div className="form-grid">
              {/* Age */}
              <div className="form-field">
                <label className="form-label">Age (years)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  step="0.1"
                  required
                  className="form-input"
                  placeholder="Enter age"
                />
              </div>

              {/* Marriage Status */}
              <div className="form-field">
                <label className="form-label">Marriage Status</label>
                <select
                  name="marriageStatus"
                  value={formData.marriageStatus}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Weight */}
              <div className="form-field">
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  step="0.1"
                  required
                  className="form-input"
                  placeholder="Enter weight"
                />
              </div>

              {/* BMI */}
              <div className="form-field">
                <label className="form-label">BMI</label>
                <input
                  type="number"
                  name="bmi"
                  value={formData.bmi}
                  onChange={handleChange}
                  step="0.1"
                  required
                  className="form-input"
                  placeholder="Enter BMI"
                />
              </div>

              {/* Regular Cycle */}
              <div className="form-field">
                <label className="form-label">Regular Cycle</label>
                <select
                  name="regularCycle"
                  value={formData.regularCycle}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Cycle Length */}
              <div className="form-field">
                <label className="form-label">Cycle Length (days)</label>
                <input
                  type="number"
                  name="cycleLength"
                  value={formData.cycleLength}
                  onChange={handleChange}
                  step="1"
                  required
                  className="form-input"
                  placeholder="Enter cycle length"
                />
              </div>

              {/* Skin Darkening */}
              <div className="form-field">
                <label className="form-label">Skin Darkening (0-1)</label>
                <input
                  type="number"
                  name="skinDarkening"
                  value={formData.skinDarkening}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="1"
                  required
                  className="form-input"
                  placeholder="0 to 1"
                />
              </div>

              {/* Hair Growth */}
              <div className="form-field">
                <label className="form-label">Excessive Hair Growth</label>
                <select
                  name="hairGrowth"
                  value={formData.hairGrowth}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Weight Gain */}
              <div className="form-field">
                <label className="form-label">Weight Gain (kg)</label>
                <input
                  type="number"
                  name="weightGain"
                  value={formData.weightGain}
                  onChange={handleChange}
                  step="0.1"
                  required
                  className="form-input"
                  placeholder="Recent weight gain"
                />
              </div>

              {/* Fast Food Intake */}
              <div className="form-field">
                <label className="form-label">Fast Food Intake</label>
                <select
                  name="fastFood"
                  value={formData.fastFood}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="non">Non</option>
                  <option value="mild">Mild</option>
                  <option value="heavy">Heavy</option>
                  <option value="severe">Severe</option>
                </select>
              </div>

              {/* Pimples */}
              <div className="form-field">
                <label className="form-label">Pimples</label>
                <select
                  name="pimples"
                  value={formData.pimples}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="non">Non</option>
                  <option value="mild">Mild</option>
                  <option value="heavy">Heavy</option>
                  <option value="severe">Severe</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="submit-button-container">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="submit-button"
              >
                {isLoading ? "Analyzing..." : "TAKE TEST"}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <p className="error-text">{error}</p>
              </div>
            )}

            {/* Success/Risk Message */}
            {response && (
              <div className={`response-message ${response.atRisk ? 'at-risk' : 'not-at-risk'}`}>
                <p className={`response-title ${response.atRisk ? 'at-risk' : 'not-at-risk'}`}>
                  {response.message}
                </p>
                <p className="response-description">
                  {response.atRisk 
                    ? "Please consult a healthcare professional for proper diagnosis and treatment." 
                    : "Keep maintaining a healthy lifestyle!"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="predict-footer">
          <p className="disclaimer-text">
            This is a screening tool and not a diagnostic test. Always consult with healthcare professionals for proper medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Predict;