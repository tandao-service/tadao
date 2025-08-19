"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

export default function PhoneVerification({
  onVerified,
}: {
  onVerified: (phone: string) => void;
}) {
  const [countryCode, setCountryCode] = useState("+254");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => { },
        "expired-callback": () => {
          console.warn("reCAPTCHA expired");
        },
      });

      verifier.render().then(() => {
        window.recaptchaVerifier = verifier;
      });
    }
  }, []);

  const sendOtp = async () => {
    setError("");
    const fullPhone = `${countryCode}${phone.trim()}`;

    if (!phone.match(/^\d{7,12}$/)) {
      setError("Enter a valid phone number.");
      return;
    }

    if (!window.recaptchaVerifier) {
      setError("reCAPTCHA is not ready. Please try again.");
      return;
    }

    setLoading(true);
    try {
    
      const result = await signInWithPhoneNumber(
        auth,
        fullPhone,
        window.recaptchaVerifier
      );
      setConfirmResult(result);
    } catch (err: any) {
      console.log(err);
      setError("Failed to send OTP. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!confirmResult) return;
    setError("");
    setLoading(true);
    try {
      const res = await confirmResult.confirm(otp);
      onVerified(res.user.phoneNumber || "");
    } catch (err: any) {
      console.error(err);
      setError("Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {!confirmResult ? (
        <div className="flex flex-col md:flex-row gap-2 w-full">
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="border px-2 py-1 rounded w-full md:w-auto"
          >
            <option value="+254">Kenya (+254)</option>
            <option value="+213">Algeria (+213)</option>
            <option value="+244">Angola (+244)</option>
            <option value="+229">Benin (+229)</option>
            <option value="+267">Botswana (+267)</option>
            <option value="+226">Burkina Faso (+226)</option>
            <option value="+257">Burundi (+257)</option>
            <option value="+237">Cameroon (+237)</option>
            <option value="+238">Cape Verde (+238)</option>
            <option value="+236">
              Central African Republic (+236)
            </option>
            <option value="+235">Chad (+235)</option>
            <option value="+269">Comoros (+269)</option>
            <option value="+243">
              Democratic Republic of the Congo (+243)
            </option>
            <option value="+253">Djibouti (+253)</option>
            <option value="+20">Egypt (+20)</option>
            <option value="+240">Equatorial Guinea (+240)</option>
            <option value="+291">Eritrea (+291)</option>
            <option value="+268">Eswatini (+268)</option>
            <option value="+251">Ethiopia (+251)</option>
            <option value="+241">Gabon (+241)</option>
            <option value="+220">Gambia (+220)</option>
            <option value="+233">Ghana (+233)</option>
            <option value="+224">Guinea (+224)</option>
            <option value="+245">Guinea-Bissau (+245)</option>
            <option value="+225">Ivory Coast (+225)</option>
            <option value="+266">Lesotho (+266)</option>
            <option value="+231">Liberia (+231)</option>
            <option value="+218">Libya (+218)</option>
            <option value="+261">Madagascar (+261)</option>
            <option value="+265">Malawi (+265)</option>
            <option value="+223">Mali (+223)</option>
            <option value="+222">Mauritania (+222)</option>
            <option value="+230">Mauritius (+230)</option>
            <option value="+212">Morocco (+212)</option>
            <option value="+258">Mozambique (+258)</option>
            <option value="+264">Namibia (+264)</option>
            <option value="+227">Niger (+227)</option>
            <option value="+234">Nigeria (+234)</option>
            <option value="+242">Republic of the Congo (+242)</option>
            <option value="+250">Rwanda (+250)</option>
            <option value="+239">Sao Tome and Principe (+239)</option>
            <option value="+221">Senegal (+221)</option>
            <option value="+248">Seychelles (+248)</option>
            <option value="+232">Sierra Leone (+232)</option>
            <option value="+252">Somalia (+252)</option>
            <option value="+27">South Africa (+27)</option>
            <option value="+211">South Sudan (+211)</option>
            <option value="+249">Sudan (+249)</option>
            <option value="+255">Tanzania (+255)</option>
            <option value="+228">Togo (+228)</option>
            <option value="+216">Tunisia (+216)</option>
            <option value="+256">Uganda (+256)</option>
            <option value="+260">Zambia (+260)</option>
            <option value="+263">Zimbabwe (+263)</option>
          </select>

          <input
            className="border px-2 py-1 rounded w-full"
            placeholder="712345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            onClick={() => {
              if (!loading) sendOtp();
            }}
            className="w-full md:w-[200px] bg-black text-white py-2 rounded text-center"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-2 w-full">
          <input
            className="border px-2 py-2 rounded w-full"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={() => {
              if (!loading) verifyOtp();
            }}
            className="w-full md:w-[150px] bg-green-600 text-white py-2 rounded text-center"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div id="recaptcha-container" />
    </div>
  );
}
