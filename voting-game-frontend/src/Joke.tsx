import { useEffect, useState } from 'react';

interface Vote {
    label: string;
    value: number;
}

interface Joke {
    id: string;
    question: string;
    answer: string;
    votes: Vote[];
    availableVotes: string[];
}

const Joke = () => {
    const [joke, setJoke] = useState<Joke | null>(null);
    const [voteCounts, setVoteCounts] = useState<{ [key: string]: number }>({});
    const [showAnswer, setShowAnswer] = useState<boolean>(false); // State to control answer visibility

    const emojis = ['😂', '❤️', '👍'];

    const fetchJoke = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/joke');
            const data: Joke = await response.json();
            setJoke(data);
            setVoteCounts(data.votes.reduce((acc: { [key: string]: number }, { label, value }) => {
                acc[label] = value;
                return acc;
            }, {}));
            setShowAnswer(false); // Reset answer visibility
            setTimeout(() => {
                setShowAnswer(true); // Show answer after 5 seconds
            }, 3000);
        } catch (error) {
            console.error('Error fetching joke:', error);
        }
    };

    const handleVote = async (emoji: string) => {
        if (!joke) return;

        try {
            const response = await fetch(`http://localhost:3000/api/joke/${joke.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ vote: emoji }),
            });

            if (response.ok) {
                const updatedJoke = await response.json();
                setVoteCounts(updatedJoke.votes.reduce((acc: { [key: string]: number }, { label, value }: { label: string, value: number }) => {
                    acc[label] = value;
                    return acc;
                }, {}));
            }
        } catch (error) {
            console.error('Error submitting vote:', error);
        }
    };

    useEffect(() => {
        fetchJoke();
    }, []);
  return (
    <div className="container mt-5">
            {joke ? (
                <div className="card text-center">
                    <div className="card-body">
                        <h3 className="card-title mb-5">{joke.question}</h3>
                        <h4 className="card-text" style={{ minHeight: '1.5em' }}>{showAnswer && joke.answer}</h4>
                        <div className="mb-3">
                            {emojis.map((emoji) => (
                                <button
                                    key={emoji}
                                    className="btn btn-light mx-2"
                                    onClick={() => handleVote(emoji)}
                                >
                                    {emoji} {voteCounts[emoji] || 0}
                                </button>
                            ))}
                        </div>
                        <div className="mt-3">
                            <button className="btn btn-primary" onClick={fetchJoke}>
                                Next Joke
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
  )
}

export default Joke