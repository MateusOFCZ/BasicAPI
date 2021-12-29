# Basic JWT API Pack
A basic API model in NodeJS and Express with Json Web Tokens Authentication.


## Configuration

First install the dependencies using the command below:

    npm install
___
In **config.json** you must change the data to send to production and in the **.env** file enter the data example:

    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=pass
    DB_DATABASE=db_jwt
___
Configure your **public.key** and **private.key**, click [here](https://www.csfieldguide.org.nz/en/interactives/rsa-key-generator/) and generate a key:
- **Format Scheme:** PKCS #1 (base64)
- **Key Size:** 2048 bits
---
To start the project run:

    node .
