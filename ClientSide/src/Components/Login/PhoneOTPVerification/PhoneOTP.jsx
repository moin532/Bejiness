import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import OTPInput from "./OTPInput";

const firebaseConfig = {
    apiKey: "AIzaSyCbG9FuW5m7matWNJuNW4eRNmgJSkFiY2U",
    authDomain: "opt-3-874e2.firebaseapp.com",
    projectId: "opt-3-874e2",
    storageBucket: "opt-3-874e2.appspot.com",
    messagingSenderId: "325995639942",
    appId: "1:325995639942:web:45b5bc194e414a791fcd07",
    measurementId: "G-G6HXLDS6MQ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function PhoneOTP(props) {
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [recaptcha, setRecaptcha] = useState(null);
    const [showButton, setShowButton] = useState(true);

    useEffect(() => {
        const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
            size: "invisible",
        });
        setRecaptcha(recaptchaVerifier);
    }, []);

    const sendOTP = () => {
        if (props.phoneNumber == "") {
            alert("enter valid phone number")
            return;
        }
        setIsButtonDisabled(true);

        if (!isButtonDisabled) {
            const phoneNumber = props.phoneNumber;
            const appVerifier = recaptcha;
            try {
                signInWithPhoneNumber(auth, phoneNumber, appVerifier)
                    .then((confirmationResult) => {
                        window.confirmationResult = confirmationResult;
                        console.log(confirmationResult);
                        alert("OTP sent successfully!");
                    })
                    .catch((error) => {
                        console.error("Error sending OTP:", error);
                        setIsButtonDisabled(false);
                        alert("Failed to send OTP. Please try again.");
                    });
            } catch (error) {
                switch (error.code) {
                    case "auth/too-many-requests":
                        alert("Too many requests. Please try again later.");
                        break;
                    case "auth/invalid-phone-number":
                        alert("The phone number is invalid.");
                        break;
                    default:
                        alert("Something went wrong. Please try again later.");
                        break;
                }
                console.log(error);
            } finally {
                setIsButtonDisabled(false);
                setShowButton(false)
            }
        }
    }

    return (
        <div className="mb-3">
            <label htmlFor="phone_number" className="form-label">Phone Number</label>
            <input
                type="text"
                className="form-control login-form-control"
                id="inputEmail3"
                placeholder="+91 xxxxxxxxxx"
                onChange={(e) => props.handlePhoneNumberChange(e)}
                value={props.phoneNumber}
                required
            />
            <div className="phone-btn text-center">
                {
                    showButton ?
                        <>
                            <button
                                className="btn btn-outline-success"
                                onClick={sendOTP}
                                id="signup-btn"
                                disabled={isButtonDisabled}
                            >
                                <span>Send OTP</span>
                            </button>
                            <br />
                        </>
                        :
                        <>
                            <OTPInput 
                                // OTPIsVerified={props.setOTPIsVerified}
                                resendOTP={sendOTP}
                            />
                        </>
                }

                <div id="recaptcha"></div>  
            </div>
        </div>
    )
}
