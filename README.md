# Gather

Gather is a web app inspired by the popular [Meetup](https://www.meetup.com) site. Gather enables you to join and create groups or events in any city.

[Click here for live view of site.](https://gather.city)

# Wiki Links
  * [API Documentation](https://github.com/cgrq/Gather/wiki/API-Documentation)
  * [Database Schema](https://github.com/cgrq/Gather/wiki/Database-Schema)
  * [Feature List](https://github.com/cgrq/Gather/wiki/Feature-List)
  * [Redux Store Shape](https://github.com/cgrq/Gather/wiki/Redux-Store-Shape)

# Tech Stack

Frameworks and Libraries:

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

Database:

![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

Hosting:

![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white) ![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)


# Homepage

![landing page](assets/docs/gather-ui.png)

# Running project locally

## Step 1 (Run backend)

* Index into backend folder

    ``` cd /backend```

* Install dependencies:

  ``` npm install ```

* Create .env file by following the ```.env.example``` file given.

* Build database using the following commands:

  ```
  npx dotenv sequelize db:create
  npx dotenv sequelize db:migrate
  npx dotenv sequelize db:seed:all
  ```

* And run the following command:

  ``` npm start ```
## Step 2 (Run frontend)

* Index into frontend folder

  ``` cd /frontend```

* Install dependencies:

  ``` npm install ```

* And run the following command to be able to visit the site at https://localhost:3000:

  ``` npm start ```


# Roadmap

  * Groups (Complete)
  * Events (Complete)
  * Search (coming soon)
  * Events Calendar (coming soon)
  * AWS/S3 Image Upload (coming soon)
  * Google Maps Integration (coming soon)

# Contact

Feel free to message me on [LinkedIn](https://www.linkedin.com/in/c--r/)!
