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
Para rodar o projeto utilize:

    node .
___
Não se esqueça de importar o banco de dados e habilitar o SMTP do e-mail, recomendamos utilizar o GMail.
