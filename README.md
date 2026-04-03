<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
# 🔍 Code Review AI

An AI-powered code review tool — paste your code or upload a file and get instant, intelligent feedback powered by GPT-4o.

🌐 **Live Demo**: [https://code-review-ai-frontend-tcy4.onrender.com](https://code-review-ai-frontend-tcy4.onrender.com)

---

## ✨ Features

- 📋 **Paste code** directly into the editor for instant review
- 📁 **Upload code files** for automated analysis
- 🤖 **AI-powered feedback** using OpenAI GPT-4o
- 🕐 **Review history** — track past submissions in session
- 🛡️ **Rate limiting** — 10 requests/minute to prevent abuse
- 🌍 **CORS-enabled** for seamless frontend-backend communication

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI, Uvicorn |
| AI | OpenAI GPT-4o |
| Rate Limiting | SlowAPI |
| Deployment | Render (Web Services) |

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- Python 3.10+
- OpenAI API key

### 1. Clone the repo
```bash
git clone https://github.com/PerceptronCipher/code-review-ai.git
cd code-review-ai
```

### 2. Backend
```bash
cd backend
pip3 install -r requirements.txt
```

Create a `.env` file in `backend/`:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

Start the server:
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please follow conventional commits and keep PRs focused.

---

## 📄 License

MIT © [PerceptronCipher](https://github.com/PerceptronCipher) and [Hilosthone](https://github.com/Hilosthone)
>>>>>>> dbed101d74b57fc5b16c90374983a64b690a3b4d
