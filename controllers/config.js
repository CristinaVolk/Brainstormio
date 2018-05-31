const CONFIG = {
    DB_URL:'mongodb://admin:admin@ds229790.mlab.com:29790/brainstorm',
    DB_URL_AUTH: {
        PASSWORD: "admin",
        USER: "admin"
      },
      HASH_PASSWORD_SECRET: process.env.HASH_PASSWORD_SECRET || 'shhhhh'
};

module.exports = CONFIG;
