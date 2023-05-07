while true
do
    git pull
    cp data.db databackup.db
    npx sequelize-cli db:migrate
    npm install
    npm start
done