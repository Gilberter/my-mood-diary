interface PredictionResponse {
    status: boolean;
    message: string;
    class: number;
    probability: number;
}

export const getPrediction = async (text: string): Promise<PredictionResponse> => {
    try {
        const response = await fetch("http://localhost:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text }) // Sends { text: "..." } to FastAPI
        });

        const data = await response.json(); // Parse the response body

        if (!response.ok) {
            throw new Error(data.message || "Something happened");
        }

        return data as PredictionResponse; // Return as typed object
    } catch (err) {
        throw new Error("Network error or unknown issue.");
    }
};
