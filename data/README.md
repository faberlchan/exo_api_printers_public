
temporary solution :
in terminal, at root of project, do cmd : 

curl -X POST http://localhost:3000/printer/upsertMany \
     -H "Content-Type: application/json" \
     -d @data/support-transverse-itg-printers.json

curl -X POST http://localhost:3000/printer/upsertMany \
     -H "Content-Type: application/json" \
     -d @data/half-printers.json


curl -X POST http://localhost:3000/printer/upsertMany \
     -H "Content-Type: application/json" \
     -d @data/3-printers.json
Todo later : 

in a monorepo, create an app that is constantly sending updated data.