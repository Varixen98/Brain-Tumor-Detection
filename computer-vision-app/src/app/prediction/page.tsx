"use client";

import { useState, useRef } from "react";
import Navbar from "../components/navbar";
import DarkVeil from "../components/darkveil";

export default function PredictionPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection with validation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // 1. Reset states
      setError(null);
      setResult(null);

      // 2. Create an image object to check dimensions
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;

      img.onload = () => {
        // 3. Validation Logic: Check if width or height is less than 64px
        if (img.width < 64 || img.height < 64) {
          setError(
            `Image is too small (${img.width}x${img.height}px). Minimum requirement is 64x64 pixels.`
          );
          setImage(null);
          setPreview(null);
          if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
        } else {
          // 4. If valid, set state
          setImage(file);
          setPreview(objectUrl);
        }
      };

      img.onerror = () => {
        setError("Failed to load image. Please try another file.");
      };
    }
  };

  // Handle Prediction via API
  const handlePredict = async () => {
    if (!image) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", image);

      // Call your FastAPI backend
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process image");
      }

      const data = await response.json();
      
      // Capitalize the result (e.g., "glioma" -> "Glioma")
      const formattedResult = data.prediction.charAt(0).toUpperCase() + data.prediction.slice(1);
      setResult(formattedResult);

    } catch (err) {
      console.error("Prediction error:", err);
      setError("Server connection failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  // Helper to check if the result is positive (tumor detected)
  const isTumor = result && result.toLowerCase() !== "no tumor";

  return (
    <div className="flex flex-col items-center relative w-screen h-screen overflow-hidden text-white font-noto">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <DarkVeil />
      </div>

      {/* Navbar - Fixed height at top, reduced margin */}
      <div className="w-full flex-none mt-6 z-10 flex justify-center">
        <Navbar />
      </div>

      {/* Content Area - Two Columns */}
      <div className="flex-1 w-full max-w-6xl px-6 md:px-12 py-8 z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center min-h-0">
        {/* LEFT COLUMN: Upload Controls */}
        <div className="flex flex-col gap-6 w-full max-w-md mx-auto h-full justify-center">
          {/* Page Title */}
          <div className="text-left space-y-2">
            <h3 className="font-bold text-3xl md:text-4xl">Analyze MRI Scan</h3>
            <p className="font-light text-white/70 text-lg">
              Upload an MRI image to detect potential anomalies using our SVM
              model.
              <br />
              <span className="text-sm opacity-60">
                (Minimum resolution: 64x64 pixels)
              </span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm animate-pulse">
              {error}
            </div>
          )}

          {/* Dropzone Card */}
          <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col items-center gap-5 shadow-lg">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-40 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center relative group
                ${
                  error
                    ? "border-red-500/40 bg-red-500/5"
                    : image
                    ? "border-green-500/50 bg-green-500/10"
                    : "border-white/20 hover:border-white/40 hover:bg-white/5"
                }`}
            >
              <div className="text-center p-4 text-gray-400">
                {image ? (
                  <>
                    <svg
                      className="w-8 h-8 mx-auto mb-2 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="text-lg font-medium text-white truncate px-4 max-w-[250px]">
                      {image.name}
                    </p>
                    <p className="text-sm text-green-400">Click to change</p>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-10 h-10 mx-auto mb-3 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-lg font-medium text-white">
                      Upload Image
                    </p>
                    <p className="text-sm">Drag & drop or click</p>
                  </>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Action Button */}
            <button
              onClick={handlePredict}
              disabled={!image || loading || !!error}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2
                ${
                  !image
                    ? "bg-gray-600/20 text-gray-500 cursor-not-allowed"
                    : loading
                    ? "bg-purple-600/80 text-white cursor-wait"
                    : "bg-white text-black hover:scale-[1.02] shadow-xl hover:shadow-white/20"
                }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Running Diagnosis...
                </>
              ) : (
                "Run Diagnosis"
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Image Preview & Results */}
        <div className="w-full h-full max-h-[500px] bg-black/20 backdrop-blur-sm border border-white/10 rounded-3xl p-4 flex flex-col items-center justify-center relative shadow-inner overflow-hidden">
          {preview ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
              {/* The Image */}
              <img
                src={preview}
                alt="MRI Scan"
                className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-500 ${
                  result ? "h-[70%]" : "h-[90%]"
                }`}
              />

              {/* The Result Label */}
              {result && (
                <div
                  className={`animate-in slide-in-from-bottom-4 fade-in duration-500 absolute bottom-4 w-[90%] backdrop-blur-md border p-4 rounded-2xl flex items-center justify-between
                  ${
                    isTumor
                      ? "bg-red-500/20 border-red-500/30"
                      : "bg-green-500/20 border-green-500/30"
                  }`}
                >
                  <div className="flex flex-col">
                    <span
                      className={`text-xs uppercase tracking-wider font-bold ${
                        isTumor ? "text-red-300" : "text-green-300"
                      }`}
                    >
                      Prediction Result
                    </span>
                    <span className="text-2xl font-bold text-white">
                      {result}
                    </span>
                  </div>
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center shadow-lg ${
                      isTumor
                        ? "bg-red-500 shadow-red-500/40"
                        : "bg-green-500 shadow-green-500/40"
                    }`}
                  >
                    {isTumor ? (
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Placeholder State
            <div className="flex flex-col items-center justify-center text-white/30 gap-4">
              <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="font-light text-lg">
                Image preview will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}