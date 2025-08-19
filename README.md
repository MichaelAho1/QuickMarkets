Description

QuickMarkets is a stock market simulator designed to educate users on investing and portfolio management through a fast-paced,
realistic trading experience. Built by a team of 4, this project compresses real-time trading days into minutes,
allowing users to observe market behavior, make decisions, and learn the dynamics of stock investing quickly. 
We used Geometric Brownian Motion and market Trends to generate stock data. (Factors in drift, volatility, and long term growth).

-Acclerated Trading - 1 day = 5 minutes in the simulator


Local Setup Instructions

Frontend: React.js, JavaScript
cd client
npm install vite@latest
create a .env file
copy and paste: VITE_API_URL="http://127.0.0.1:8000" into the .env file
npm run dev

Backend: Django, Python
cd server
python -m venv env
./env/Scripts/activate (Windows Powershell)
pip install -r requirements.txt
python manage.py runserver
