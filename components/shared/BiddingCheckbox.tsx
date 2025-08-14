import { VerificationPackId } from "@/constants";
import { createTransaction } from "@/lib/actions/transactions.actions";
import { CircularProgress } from "@mui/material";
import React, { useState, ChangeEvent } from "react";

interface UserVerified {
    accountverified: boolean;
}

interface User {
    verified?: UserVerified[];
}

interface Props {
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<{ biddingEnabled: boolean }>>;
    user: any;
    handlePayNow: (id: string) => void;
}

const BiddingCheckbox: React.FC<Props> = ({ formData, setFormData, handlePayNow, user }) => {
    const [showVerifyPopup, setShowVerifyPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (
            Array.isArray(user.user?.verified) &&
            user.user?.verified[0]?.accountverified === false
        ) {
            setShowVerifyPopup(true); // Show popup instead of changing value
            return;
        }

        setFormData((prev) => ({
            ...prev,
            biddingEnabled: e.target.checked,
        }));
    };

    function generateRandomOrderId() {
        const timestamp = Date.now(); // Current timestamp in milliseconds
        return `MERCHANT_${user.user?._id}_${timestamp}`;
    }
    const handlePay = async (
        packIdInput: string,
        packNameInput: string,
        periodInput: string,
        priceInput: string
    ) => {
        const referenceId = generateRandomOrderId();
        const trans = {
            orderTrackingId: referenceId,
            amount: Number(priceInput),
            plan: packNameInput,
            planId: packIdInput,
            period: periodInput,
            buyerId: user.user?._id,
            merchantId: referenceId,
            status: "Pending",
            createdAt: new Date(),
        };
        const response = await createTransaction(trans);
        if (response.status === "Pending") {
            setLoading(false);
            setShowVerifyPopup(false);
            handlePayNow(response.merchantId)
        }
    };
    return (
        <div>
            <input
                type="checkbox"
                checked={formData.biddingEnabled}
                onChange={handleCheckboxChange}
                className="ml-2 cursor-pointer"
            />

            {/* Popup */}
            {showVerifyPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
                        <h2 className="text-lg font-semibold mb-4">Account Verification Required</h2>
                        <p className="mb-4">Please verify your account to enable bidding.</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowVerifyPopup(false)}
                                className="px-4 py-2 bg-gray-300 rounded mr-2"
                            >
                                Close
                            </button>
                            <button
                                disabled={loading}
                                onClick={() => {
                                    setLoading(true);
                                    handlePay(VerificationPackId, "Verification", "0", user.fee)
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded"
                            >
                                {loading && <CircularProgress />}
                                {loading ? "Submitting..." : ` Verify Now`}

                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BiddingCheckbox;
