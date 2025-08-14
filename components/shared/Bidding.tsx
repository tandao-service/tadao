'use client';

import { useEffect, useState } from 'react';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import ProgressPopup from './ProgressPopup';
import { placeBid } from '@/lib/actions/dynamicAd.actions';
import { updateUserPhone } from '@/lib/actions/user.actions';
import PhoneVerification from './PhoneVerification';

type adProps = {
    userId: string;
    user: any;
    ad: any;
};

export default function Bidding({ ad, userId, user }: adProps) {
    const [bids, setBids] = useState(ad?.bids || []);
    const [isOpenP, setIsOpenP] = useState(false);
    const [amount, setAmount] = useState('');
    const [phone, setPhone] = useState(user.phone);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const highest = bids.length ? Math.max(...bids.map((b: any) => b.amount)) : 0;
    const minBid = Number(highest) + Number(ad.data.bidIncrement);
    const isOwner = userId === user._id;

    const handleCloseP = () => setIsOpenP(false);

    const submitBid = async () => {
        if (!amount || Number(amount) < minBid) {
            toast({
                variant: 'destructive',
                title: 'Invalid Bid',
                description: `Bid must be at least Ksh ${minBid}`,
            });
            return;
        }



        if (!phone) {
            toast({
                variant: 'destructive',
                title: 'Phone Required',
                description: 'Enter a valid phone number before bidding.',
            });
            return;
        }
        setLoading(true);

        const response = await placeBid({
            adId: ad?._id,
            userId,
            username: `${user?.firstName} ${user?.lastName}`,
            amount: Number(amount),
            path: `/ads/${ad?._id}`,
        });

        setLoading(false);

        if (!response || typeof response !== 'object') {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Unexpected server response. Try again.',
            });
            return;
        }

        if (!response.success) {
            toast({
                variant: 'destructive',
                title: 'Bid Failed',
                description: response.message || 'Unknown error occurred',
            });
        } else {
            setBids(response.updatedBids || []);
            setAmount('');
            toast({
                title: 'Success 🎉',
                description: 'Your bid was placed!',
                className: 'bg-[#30AF5B] text-white',
            });
        }
    };
    const [shouldHideBidding, setShouldHideBidding] = useState(false);

    useEffect(() => {
        const biddingEnded = new Date(ad?.data?.biddingEndsAt) < new Date();
        const hasWinner = bids.some((b: any) => b.isWinner);
        setShouldHideBidding(biddingEnded || hasWinner);
    }, [ad, bids]);
    const handleVerified = async (phone: string) => {

        await updateUserPhone(userId || '', phone);
        // const cleanNumber = phone.startsWith('+') ? phone.slice(1) : phone;
        // const countryCode = cleanNumber.slice(0, 3);
        // const localNumber = cleanNumber.slice(3);
        // setCountryCode('+' + countryCode)
        setPhone(phone)
        // setChangePhone(false)
        // You can now save the verified phone to your database
    };
    if (shouldHideBidding) {
        return (
            <div className="text-center text-sm text-gray-600 border border-gray-200 rounded p-4 mt-6 mb-4">
                🛑 Bidding has ended for this item.
            </div>
        );
        // return null; // use this if you want to completely hide
    }
    return (
        <div className="bg-gradient-to-r from-orange-500 from-10% via-orange-400 via-40% to-orange-500 to-90% shadow rounded-xl p-4 mt-6 mb-4 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-100 border-b mb-2">Bidding Section</h2>

            <p className="text-sm text-gray-100 mb-4">
                Current Highest Bid:{' '}
                <span className="font-bold text-white">Ksh {highest.toLocaleString()}</span>
            </p>

            {!userId ? (
                <button
                    onClick={() => {
                        setIsOpenP(true);
                        router.push('/sign-in');
                    }}
                    className="text-sm text-red-600 rounded-full p-2 bg-white shadow hover:underline"
                >
                    Please login to place a bid.
                </button>
            ) : isOwner ? (
                <p className="text-gray-600 text-sm font-medium">You can&apos;t bid on your own item.</p>
            ) : (
                <div className="space-y-3">
                    {!phone && (<>
                        <div className="p-4">
                            <h1 className="text-xl font-bold mb-4">Enter your phone number</h1>
                            <PhoneVerification onVerified={handleVerified} />
                        </div>

                    </>)}
                    <input
                        type="number"
                        min={minBid}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={`Enter at least Ksh ${minBid}`}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-orange-500/40"
                    />
                    <button
                        onClick={submitBid}
                        disabled={loading}
                        className={`w-full py-2 text-white text-sm rounded ${loading
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 hover:opacity-90'
                            }`}
                    >
                        {loading ? 'Placing...' : 'Place Bid'}
                    </button>
                </div>
            )
            }

            <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">📜 Bid History</h3>
                {bids.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No bids yet.</p>
                ) : (
                    <ul className="space-y-2 max-h-40 overflow-y-auto border rounded p-2 bg-gray-100">
                        {bids
                            .slice()
                            .reverse()
                            .sort((a: any, b: any) => b.timestamp - a.timestamp)
                            .map((bid: any, idx: number) => (
                                <li key={idx} className="text-sm text-gray-700">
                                    <strong>Ksh {bid.amount.toLocaleString()}</strong> by{' '}
                                    <span className="text-gray-800 font-medium">{bid.username}</span> on{' '}
                                    {new Date(bid.timestamp).toLocaleString()}
                                </li>
                            ))}
                    </ul>
                )}
            </div>

            <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
        </div >
    );
}
