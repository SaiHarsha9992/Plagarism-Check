export async function POST(request) {
    try {
        const { code, language, testCases, input } = await request.json();

        const languageMap = {
            cpp: 54,
            python: 71,
            java: 62,
        };

        const results = [];

        // Handle testCases array (for submissions with expected outputs)
        if (testCases && Array.isArray(testCases)) {
            for (const test of testCases) {
                const res = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                    },
                    body: JSON.stringify({
                        source_code: code,
                        language_id: languageMap[language],
                        stdin: test.input,
                    }),
                });

                const output = await res.json();
                console.log("Judge0 Output:", output);


                results.push({
                    input: test.input,
                    expected: test.expected || '',
                    actual: output.stdout?.trim() || output.stderr || 'Error',
                    correct: test.expected ? output.stdout?.trim() === test.expected : undefined,
                });
            }
        }

        // Handle single custom input (when no test cases are given)
        else if (input) {
            const res = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                },
                body: JSON.stringify({
                    source_code: code,
                    language_id: languageMap[language],
                    stdin: input,
                }),
            });

            const output = await res.json();

            results.push({
                input,
                expected: '',
                actual: output.stdout?.trim() || output.stderr || 'Error',
            });
        }

        return new Response(JSON.stringify({ success: true, results }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
