# qp-assessment

## Prerequisites
- Node.js and npm installed on your machine.
- MySQL server running locally or remotely.
- MySQL Workbench (optional for managing the database).


## Installation
    
1. Clone the repository:
```bash
   git clone https://github.com/yourusername/your-repository.git 
```

2. Import the database file from the db folder
- Download the db file to your local system/server and then run the below command to import the schema.
```bash
    mysql -u root -p your_db_password < /path-to-your/db.sql file
 ```
- Replace the path /path-to-your/db.sql file with the actual path of the downloaded file on your machine.
- After the import is successful go to the backend/src/config/db.ts file and replace the password field with your database password.


3. Running the Frontend
- Navigate to the frontend/grocerystore folder and run the following command on the terminal
```bash
    npm install
```
- After the packages are installed run the below command to start the Frontend application
```bash
    npm install
```

4. Running the Backend
- Navigate to the backend folder and run the following command on the terminal
```bash
    npm install
```
- After the packages are installed run the below command to start the Backend application
```bash
    npm run dev
```

### Admin Login.
- To check the admin portal navigate to http://localhost:3000/adminlogin and use the below credentials for login
```bash
    email = admin@testorg.com
    password = @dm!n%321*
```