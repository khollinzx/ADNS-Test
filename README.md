# ADNS (Automated Deposit Notification System) #

This is a micro-service system built to send notifications when the system fails or misses to deposit a specific user on the platform. 


## Installtion

### Prequisite
````
Docker (Mac OS or Windows),
NodeJs (Express),
Nodemon,
Sequilize (MySQL),
````

### Clone Repository
Clone repo using the https link.
```
git clone https://github.com/khollinzx/ADNS-test.git 
```
OR SSH link
```
git clone git@github.com:khollinzx/ADNS-test.git 
```

### Set Up

```
Run docker-compose -p adns-test up -d
```
````
cp .env.example .env
````
change PORT variable on the ``.env`` to a port number of your choice
````
Run npm install
````
