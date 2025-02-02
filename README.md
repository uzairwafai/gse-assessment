# GSE-Assessment
  
### Base url: https://gse-assessment-x8lu.onrender.com/

  - Example request: `POST https://gse-assessment-x8lu.onrender.com/resolve-contact`

Request payload:
```

{
	"email": "a@mail.com",
	"phone": 1001
}

```
Response payload:
```

{
	“contactIds": [1],
	"emails": ["a@mail.com"],
	"phones": [1001]
}

```
- Example request: `GET https://gse-assessment-x8lu.onrender.com/resolve-contact`
	This get request checks the records created in the database.


**Note:** Used SQLite database and is hosted on onrender.com. So the contents of database gets flushed out after some time as it is a free tier hosting and may take a little while when hitting the url for the first time.