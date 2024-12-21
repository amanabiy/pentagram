'use client';

import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { Image } from 'antd'

interface Response {
    markdown: string;
    tickers: string[]; // Assuming tickers is an array of company tickers
    image_url: string; // Assuming the response contains an image URL
}

const InputResponse: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null); // State for the image URL

    const sendRequest = async () => {
        if (input.trim()) {
            setLoading(true);
            setError(null);
            setImageUrl(null); // Reset the image URL before making a new request
            try {
                const query = encodeURIComponent(input);
                const res = await fetch(`https://amanabiy--pentagram-webapp-generate-image.modal.run/?prompt=${query}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'asdfasdfasdfasdfiuy80273r08723yriusdgfajsdgfkasdgfuiOUIOUASDHFIOUASDHFUYSDF098Ypushdfoiaushdfp9sd8yf098wyefiuhasdfkjhasdilf98sdyfas',
                    },
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await res.json();
                setImageUrl(data['url']); // Set the image URL state

            } catch (error) {
                console.error('Error:', error);
                setError('An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
            setInput('');
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.trim()) {
            sendRequest();
        }
    };

    return (
        <div className={`flex flex-col h-full w-3/4 mx-auto align-center items-center text-white`}>
            <div className="w-full mb-4">
                <h1 className="text-center text-6xl font-bold mb-7">Pentagram</h1>

                {/* Explanation and Example */}
                <div className="text-center mb-6">
                    <p>Enjoy generating different kinds of images and be creative with your prompts! For example, try entering a prompt like "A futuristic cityscape at sunset with flying cars" and see the amazing results you can get.</p>
                </div>
                <div className="relative w-full">
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className="w-full py-3 pl-4 pr-16 bg-black text-white border border-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your prompt..."
                    />
                    <button
                        onClick={sendRequest}
                        disabled={!input.trim() || loading}
                        className={`absolute right-0 top-0 bottom-0 px-6 py-4 bg-blue-600 text-white rounded-r-lg shadow-md transition duration-300 ease-in-out ${(!input.trim() || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                    >
                        {loading ? 'Loading...' : 'Send'}
                    </button>
                </div>
            </div>
            {error && <div className="text-red-500">{error}</div>}
            {imageUrl && <Image src={imageUrl} alt="Generated" className="mt-4" />}
        </div>
    );
};

export default InputResponse;
