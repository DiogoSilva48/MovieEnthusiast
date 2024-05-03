# MovieEnthusiast

## Introduction

MovieEnthusiast is a web application that allows users to explore and discover movies in three different ways:

1.  Infinite scroll: Users can scroll through a list of movies endlessly, loading more as they reach the end of the page.
2.  Top 10 movies by revenue: Users can view a curated list of the top 10 highest-grossing movies.
3.  Top 10 movies by revenue for a specific year: Users can explore the top 10 highest-grossing movies for a particular year.

## Technologies

- Frontend: React with Vite
- Backend: Node.js
- Data Source: TMDb API (The Movie Database)
- Database: MongoDB
- Docker: Docker containers for easy deployment

## Little Explanation

I have decided to include two different backends, one which is only using the TMDb API directly in Node.js, because this was the first I did, and allows to use the whole list of movies provided by The Movie Database (this is inside the 'backend-justapi' folder), and the other backend where I used a MongoDB database and I just use the TMDb API to fetch the movies and save them to the database, this solution is better because we only need to use the TMDb API once (or more if we want do an update) (this is inside the 'backend' folder). The latter has a limited amount of movies, just because it would be a very tedious process to download all of them and this number is already enough to demonstrate all functionalities.

I've also included two ways of running the app, one is through the "traditional way" which is by having Node.js and NPM installed locally on the machine and having a MongoDB already running or using one in MongoDB Atlas. The other way is by using Docker, which creates containers for React, Node.js, and MongoDB, which makes it very easy, this one I only made available for the backend with Node.js, which is the one it made sense for.

## Setup Instructions

### "Traditional" setup

1.  Clone the Repository

    `git clone https://github.com/DiogoSilva48/MovieEnthusiast`

    `cd MovieEnthusiast`

2.  Backend Setup:
    `cd backend` or `cd backend-justapi`

    - For the backend without MongoDB:

      - Create a `.env` file in the backend-justapi directory with the following content:

        `API_KEY=your_tmdb_api_key`

    - For the backend with MongoDB:

      - Create a `.env` file in the backend directory with the following content:

        `API_KEY=your_tmdb_api_key`

        `DB_URI=your_mongodb_uri`

        Make sure to replace `your_tmdb_api_key` with your actual TMDb API key and `your_mongodb_uri` with your MongoDB URI. For each of these there's a ` .env.example`, which you can follow as well. There's also a way to use the MongoDB backend without the TMDb API key (see bellow).

3.  Install Backend dependencies:

    `npm install`

4.  Start the Backend Server:

    `npm start`

5.  Frontend Setup:

    `cd frontend`

6.  Install Frontend dependencies:

    `npm install`

7.  Start the Frontend Server:

    `npm run dev`

### Docker setup

1. Clone the Repository

   `git clone https://github.com/DiogoSilva48/MovieEnthusiast`

   `cd MovieEnthusiast`

2. Backend Setup:

   - Modify the `docker-compose.yml` file:
     - Add your TMDb API key to the `API_KEY` environment variable under the `backend` service.
   - Run the following commands to build and run Docker containers:

     `docker-compose build frontend backend`

     `docker-compose up`

### Data "Pre-fetching"

**This step is only required for the Backend with MongoDB or Docker Setup**. Since our database doesn't have any data yet, before we access our web application, we need to do an additional step to fetch movie details from the TMDb API and save them to the database.

You need to access the following endpoint through the browser or through Postman using GET:

`http://localhost:3000/api/fetchMovieDetails`

This is a process that takes a considerable amount of time, which is why I added an **alternative**, which doesn't require the TMDb API, which includes a pre-fetched collection of movies, which are added very quickly by using the following endpoint through the browser or through Postman using GET:

`http://localhost:3000/api/import`

### Accessing the web application

With the other steps done, all you need to do is access the web application through the browser by going to `http://localhost:5173/`.
