while true
do
    git pull
    cp data.db databackup.db
    npm install
    npx sequelize-cli db:migrate
    npm start
done