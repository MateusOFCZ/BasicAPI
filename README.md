<a target="_blank" href="https://github.com/MateusOFCZ/BasicAPI/"><img align="center" src="https://i.imgur.com/1zBMebE.png"></a>

Modelo de autenticação JWT em NodeJS com Express e verificação de e-mail no registro.


## Configuração

Instale as dependências utilizando o comando abaixo:

    npm install
___
Em **config.json** altere as informações necessárias e em **.env** altere as informações do banco de dados exemplo:

    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=pass
    DB_DATABASE=db_jwt
___
Configure sua **public.key** e **private.key**, clique [aqui](https://www.csfieldguide.org.nz/en/interactives/rsa-key-generator/) e gere suas keys com as opções:
- **Format Scheme:** PKCS #1 (base64)
- **Key Size:** 2048 bits
___
Para rodar o projeto utilize:![68747470733a2f2f692e696d6775722e636f6d2f317a424d6562452e706e67](https://user-images.githubusercontent.com/41977530/147789656-8206380d-2f97-40cf-9ca3-2e95ff4259a1.png)![68747470733a2f2f692e696d6775722e636f6d2f317a424d6562452e706e67](https://user-images.githubusercontent.com/41977530/147789680-fa046c7f-70ae-4eb0-a1bf-5e5674f7cda8.png)



    node .
___
Não se esqueça de importar o banco de dados e habilitar o SMTP do e-mail, recomendamos utilizar o GMail.
