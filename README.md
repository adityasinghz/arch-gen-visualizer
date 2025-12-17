# 🔮 Arch-Gen Visualizer

> **Turn Code into Beautiful Architecture Diagrams instantly.**

Arch-Gen is an AI-powered visualization tool that analyzes your source code (Python, C++, Java, etc.) and generates professional Flowcharts and Class Diagrams using Mermaid.js.

![UI Preview](https://via.placeholder.com/800x450.png?text=Holographic+UI+Preview)
*(Replace with actual screenshot if available)*

---

## ✨ Features

- **🔮 Holographic Interface:** A sleek, deep-space aesthetic featuring an animated **Aurora Background**, Glassmorphism panels, and Neon accents.
- **🧠 Smart Auto-Detection:** No need to select a language. Just paste your code, and the AI identifies syntax automatically (supports Python, JS, C++, Java, Go, and more).
- **🛡️ Strict Validation:** The engine rejects invalid code or gibberish with clear error nodes, ensuring no hallucinations.
- **⚡ JSON-Based Engine:** Uses a deterministic JSON-to-Mermaid generation strategy to guarantee **100% valid syntax** (no more lexical errors).
- **🔍 Interactive Viewer:** Zoom, Pan, and Reset your diagrams with a smooth, intuitive control set.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **AI Model:** OpenAI `gpt-4o-mini`
- **Visualization:** [Mermaid.js](https://mermaid.js.org/)
- **UI Library:** Material UI (MUI v5)
- **Editor:** Monaco Editor

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- An OpenAI API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/adityasinghz/arch-gen-visualizer.git
    cd arch-gen-visualizer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Environment:**
    Create a `.env.local` file in the root directory:
    ```bash
    OPENAI_API_KEY=sk-your-api-key-here
    ```

4.  **Run the application:**
    ```bash
    npm run dev
    ```

5.  **Open in Browser:**
    Navigate to [http://localhost:3000](http://localhost:3000).

## 💡 How to Use

1.  **Paste Code:** Copy function or class code from your IDE.
2.  **Visualize:** Click the **"Visualize"** button. The AI analyzes the logic.
3.  **Explore:** Use the mouse wheel to zoom/pan.
4.  **Export:** Download the diagram as an SVG.

## 📄 License

MIT License. Designed by Aditya Singh.
