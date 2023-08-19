import React, { useState, useEffect } from 'react';

function Result() {
    const [mergedNumbers, setMergedNumbers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAndMergeNumbers = async () => {
            try {
                // Define the list of URLs
                const urls = [
                    'http://20.244.56.144/numbers/primes',
                    'http://20.244.56.144/numbers/fibo',
                    'http://20.244.56.144/numbers/odd',
                ];

                // Fetch data from each URL in parallel using Promise.all
                const responses = await Promise.all(urls.map(url => fetch(url)));

                // Process responses and extract numbers
                const numbersLists = await Promise.all(
                    responses.map(async (response) => {
                        if (response.ok) {
                            const data = await response.json();
                            return data.numbers;
                        } else {
                            throw new Error(`Error fetching data from ${response.url}`);
                        }
                    })
                );

                // Merge and sort the numbers
                const mergedNumbers = Array.from(new Set(numbersLists.flat())).sort((a, b) => a - b);

                // Convert the merged numbers to the desired JSON format without spacing
                const formattedOutput = JSON.stringify({ numbers: mergedNumbers });

                setMergedNumbers(formattedOutput);
            } catch (error) {
                setError('Error fetching and merging numbers: ' + error.message);
            }
        };

        fetchAndMergeNumbers();
    }, []);

    return (
        <div>
            {mergedNumbers && (
                <pre>
                    <code>
                        {mergedNumbers}
                    </code>
                </pre>
            )}
            {error && <p>{error}</p>}
        </div>
    );
}

export default Result;