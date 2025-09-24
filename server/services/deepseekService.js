import OpenAI from 'openai';

// AI Configuration
const openai=new OpenAI({
    baseURL:'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY
})

//Chat with Bot Functions
export const createCompletion= async (prompt) => {
    try {
        const completion=await openai.chat.completions.create({
            messages: [
                {role: 'system', content: 'You are a helpful assistant'},
                {role: 'user', content: prompt}
            ],
            model:'deepseek-chat',
            strea: false
        });

        return completion.choices[0].message.content;
    } catch (error) {
        throw new Error('Completion failed: '+error.message);
    }
}