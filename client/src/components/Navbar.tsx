import { ConnectWallet } from "./ConnectWallet";
import { useWalletStore } from "../store/useWalletStore";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const { address } = useWalletStore();
    const navigate = useNavigate();

    function handleChallenges() {
        if (address) {
            navigate('/challenges');
        } else {
            navigate('/');
        }
    }
    return (
        <nav className="border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Link to={'/'}>
                            <span className="text-violet-500 font-bold text-2xl">ResolutionDAO</span>
                        </Link>
                    </div>
                    <div className="flex gap-8 items-center">
                        <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
                        <p onClick={handleChallenges} className="text-gray-300 hover:text-white cursor-pointer">Challenges</p>
                        <a href="#twitter" className="text-gray-300 hover:text-white">Community</a>
                        <button>
                            <ConnectWallet />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}