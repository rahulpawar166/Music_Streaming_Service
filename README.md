# CS 554 A Final Project - Incognito

- Incognito is a digital music streaming service that gives you access to a vast variety of songs and content from around the world.
- Group Members: Peter Rauscher, Rahul Pawar, Krina Uday Shah, Keyur Rasikbhai Senjaliya, Nidhi Parekh
- This project uses ReactJS, Firebase, ExpressJS, Redis, MongoDB, and Spotify API.

# Dependencies

- ImageMagick
  - Install the ImageMagick command line tool: https://imagemagick.org/script/download.php<br/>
  - ImageMagick support MacOS, Linux and Windows
    - MacOS
      - `brew install imagemagick` if you have [Homebrew](https://brew.sh/) (which you totally should)
        - If you don't, install it with - `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
    - Linux
      - `sudo apt-get install imagemagick` or see [this page](https://imagemagick.org/script/download.php) for distribution-specific details
    - Windows
      - Download [.exe file from bottom of the page here](https://imagemagick.org/script/download.php) and run
- MongoDb
  - Install the latest version of MongoDB Community Server:
  - https://www.mongodb.com/try/download/community
- Redis
  -- https://redis.io/docs/getting-started/installation/<br/>
  -- Redis supports MacOS and Linux. For Windows, you need to enable WSL2 or install on Ubuntu/Debian
  --> To start redis type: redis-cli
- Heroku
- NodeJS
  -- Install v16.18.1<br/>
  -- https://nodejs.org/download/release/v16.18.1/<br/>

# How to Set Up Application:

1. Clone the repository
2. Open the folder in a source-code editor like Visual Studio Code
3. Type cd client and cd server in two different terminals and Run `npm i` or `npm install` in order to install all the required libraries for this project
4. Run `npm run seed` to run the task of seeding the db
5. Run `npm start` to start the router

# Credentials

- In order to use this application, you must have a Spotify Account (Premium preferred)
  Username: **_
  <br/>Password: _**<br/>

# How Does Incognito Work?

1. When you open the website, the first page will be the Authentication page.
2. A non-authenticated user will have to register or login to utilize the application.
3. Once logged in, the user will be able to access the home page that shows their music.
4. The user is able to search for a track/album/artist and play a song.
5. The user can add a song to their playlist. Users can add, edit, and delete their playlist.
6. Users also have exposure to different categories of music and can be recommended new music.

# Github Repo Link

- https://github.com/rahulpawar166/Music_Streaming_Service
