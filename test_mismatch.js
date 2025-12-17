const fetch = require('node-fetch');

const runTest = async () => {
    const url = 'http://localhost:3000/api/visualize';

    // payload: C++ code, but we claim it is 'python'
    const payload = {
        code: `
#include <iostream>
int main() {
    std::cout << "Hello";
    return 0;
}
    `,
        language: "python", // MISMATCH!
        diagramType: "flowchart"
    };

    console.log("Sending Mismatch Request...");
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("Response Status:", response.status);
        console.log("Mermaid Output:\n", data.graphDefinition);

        if (data.graphDefinition && data.graphDefinition.toLowerCase().includes("mismatch")) {
            console.log("\nPASS: Error Node detected!");
        } else {
            console.log("\nFAIL: No error detected. Prompt may have ignored the instruction.");
        }
    } catch (err) {
        console.error("Error:", err);
    }
};

runTest();
