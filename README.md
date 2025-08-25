Description

QuickMarkets is a stock market simulator designed to educate users on investing and portfolio management through a fast-paced,
realistic trading experience. Built by a team of 4, this project compresses real-time trading days into minutes,
allowing users to observe market behavior, make decisions, and learn the dynamics of stock investing quickly. 
We used Geometric Brownian Motion and market Trends to generate stock data. (Factors in drift, volatility, and long term growth).

-Acclerated Trading - 1 day = 5 minutes in the simulator


Local Setup Instructions

Frontend: React.js, JavaScript

1. cd client

2. npm install vite@latest

3. create a .env file

4. copy and paste: VITE_API_URL="http://127.0.0.1:8000" into the .env file

5. npm run dev

Backend: Django, Python

1. cd server

2. python -m venv env

3. ./env/Scripts/activate (Windows Powershell)

4. pip install -r requirements.txt

5. python manage.py runserver
