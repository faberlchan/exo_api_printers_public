## recieved data format (brut) 
--> comes from support-transverse-api  (works with cegid only)
[
  {
    "id": "string",
    "label": "string",
    "storeId": "string",
    "storeLabel": "string",
    "type": "A4"
  }
]


which means that id will change when either of those value changes


in use : 
full list of of printers will be sent every 15min from support-transverse-api.
the data will have to be treated as follow : 
__storeId --> rename into legacy_site_id__
will have to find for each __legacy_site_id__ the corresponding __site_id__ (== actually id)
(so basically change storeId and push legacy_site_id)

challenge : what is the best way to update the db with incomming data while keeping it readable ? 




additionnal informations : 
label --> ignore for now
storeLabel --> ignore for now
storeLabel --> rename into siteName

type A4/TAG/ID

legacy = cegid
actual = sap 
--> H wants to drop cegid to go towards sap 


id seems to be a join of Lablel, storeId and type with "_" as separators