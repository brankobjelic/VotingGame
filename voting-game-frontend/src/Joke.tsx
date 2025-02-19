import { useEffect, useState } from 'react';
import { useSession } from './SessionContext'; // Import the useSession hook

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
    const { user, login, logout } = useSession(); // Use session context
    const [joke, setJoke] = useState<Joke | null>(null);    // State to store joke data
    const [voteCounts, setVoteCounts] = useState<{ [key: string]: number }>({});    // State to store vote counts
    const [showAnswer, setShowAnswer] = useState<boolean>(false);   // State to control answer visibility

    const emojis = ['😂', '❤️', '👍'];

    // Function to fetch a random joke from the server
    const fetchJoke = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/joke');
            const data: Joke = await response.json();
            setJoke(data);
            setVoteCounts(data.votes.reduce((acc: { [key: string]: number }, { label, value }) => {
                acc[label] = value; // // Update vote counts
                return acc;
            }, {}));
            setShowAnswer(false); // Reset answer visibility
            setTimeout(() => {
                setShowAnswer(true); // Show answer after 3 seconds
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

    // Effect to fetch a joke when the component mounts
    useEffect(() => {
        fetchJoke();
    }, []);

  return (
    <div className="container mt-5">
        <div className="text-center mb-3">   {/* Display login/logout button */}
            {user ? (
                <>
                    <h5>Welcome, {user}!</h5>
                    <button className="btn btn-danger" onClick={logout}>Logout</button>
                </>
            ) : (
                <button className="btn btn-success" onClick={() => login('User')}>Login</button>
            )}
        </div>
            {joke ? (   // Render joke if available
                <div className="card text-center">
                    <div className="card-body">
                        <h3 className="card-title mb-5">{joke.question}</h3>    {/* Display joke question */}
                        <h4 className="card-text" style={{ minHeight: '1.5em' }}>{showAnswer && joke.answer}</h4>   {/* Show answer if visible. Shows 3 seconds after fetch */}
                        <div className="mb-3">
                            {emojis.map((emoji) => (    // Render voting buttons for each emoji
                                <button
                                    key={emoji}
                                    className="btn btn-light"
                                    onClick={() => handleVote(emoji)}   // Handle vote on click
                                >
                                    {emoji} {voteCounts[emoji] || 0}    {/* Display vote count for each emoji */}
                                </button>
                            ))}
                        </div>
                        <div className="mt-3">
                            <button className="btn btn-primary" onClick={fetchJoke}>    {/* Button to fetch next joke */}
                                Next Joke
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>   // Show loading text while fetching joke
            )}
        </div>
  )
}

export default Joke