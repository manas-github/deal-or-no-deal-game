// Netlify serverless function to handle API requests
export const handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      message: "Deal or No Deal API is running on Netlify Functions",
      status: "online"
    }),
    headers: {
      "Content-Type": "application/json"
    }
  };
};
