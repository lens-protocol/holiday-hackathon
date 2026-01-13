import { ChallengeList } from '../../components/ChallengeList';
import { CreateChallenge } from '../../components/CreateChallenge';

export default function ChallengesList() {
    return (
        <div className='bg-black p-5'>
            <ChallengeList />
            <div>
                <p
                    className="fixed bottom-4 right-4 text-white shadow-lg transition duration-300"
                >
                    <CreateChallenge />
                </p>
            </div>
        </div>
    )
}