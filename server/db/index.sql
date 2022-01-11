create TABLE customer(
    id SERIAL PRIMARY KEY NOT NULL,
    surname VARCHAR(50) NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    patronymic VARCHAR(50),
    dateOfBirth DATE NOT NULL,
    gender VARCHAR(3) NOT NULL,
    registration VARCHAR(255) NOT NULL,
    phone DECIMAL(11) NOT NULL,
    email VARCHAR(255)
);

create TABLE passport(
    id SERIAL PRIMARY KEY NOT NULL,
    series INTEGER NOT NULL,
    number_ INTEGER NOT NULL,
    dateOfIssue DATE NOT NULL,
    issued VARCHAR(255) NOT NULL,
    code INTEGER NOT NULL,
    id_customer INTEGER,
    FOREIGN KEY (id_customer) REFERENCES customer(id)
);

create TABLE driverLicense(
    id SERIAL PRIMARY KEY NOT NULL,
    number1 DECIMAL(10) NOT NULL,
    dateStart DATE NOT NULL,
    dateEnd DATE NOT NULL,
    nameOfTheDivision VARCHAR(255) NOT NULL,
    id_customer INTEGER,
    FOREIGN KEY (id_customer) REFERENCES customer(id)
);

create TABLE category(
    id SERIAL PRIMARY KEY NOT NULL,
    category VARCHAR(1) NOT NULL
);

create TABLE licenseCategory(
    id_license INTEGER,
    id_category INTEGER,
    FOREIGN KEY (id_license) REFERENCES driverLicense(id),
    FOREIGN KEY (id_category) REFERENCES category(id)
);

create TABLE mark(
    id SERIAL PRIMARY KEY NOT NULL,
    name_ VARCHAR(255) NOT NULL
);

create TABLE model(
    id SERIAL PRIMARY KEY NOT NULL,
    nameModel VARCHAR(255) NOT NULL,
    id_mark INTEGER,
    FOREIGN KEY (id_mark) REFERENCES mark(id)
);

create TABLE car(
    id SERIAL PRIMARY KEY NOT NULL,
    VIN VARCHAR(17) NOT NULL,
    year DECIMAL(4) NOT NULL,
    id_category_ INTEGER,
    id_model_ INTEGER,
    id_mark_ INTEGER,
    id_customer_ INTEGER,
    FOREIGN KEY (id_category_) REFERENCES category(id),
    FOREIGN KEY (id_model_) REFERENCES model(id),
    FOREIGN KEY (id_mark_) REFERENCES mark(id),
    FOREIGN KEY (id_customer_) REFERENCES customer(id)
);

create TABLE agent(
    id SERIAL PRIMARY KEY NOT NULL,
    surname_ VARCHAR(50) NOT NULL,
    firstname_ VARCHAR(50) NOT NULL,
    patronymic_ VARCHAR(50),
    work BOOLEAN NOT NULL,
    login_ VARCHAR(50) NOT NULL,
    password_ VARCHAR(50) NOT NULL
);

create TABLE policyMy(
    id SERIAL PRIMARY KEY NOT NULL,
    numerPolic DECIMAL(10) NOT NULL,
    dateStart_ DATE NOT NULL,
    dateEnd_ DATE NOT NULL,
    cost DECIMAL NOT NULL,
    onlyDamage BOOLEAN NOT NULL,
    damageTheft BOOLEAN NULL NULL,
    franchise BOOLEAN NOT NULL,
    sumFranchise DECIMAL,
    id_car_ INTEGER,
    id_client_ INTEGER,
    FOREIGN KEY (id_car_) REFERENCES car(id),
    FOREIGN KEY (id_client_) REFERENCES customer(id)
);

create TABLE docRegistr(
    id SERIAL PRIMARY KEY NOT NULL,
    numerDoc DECIMAL(10) NOT NULL,
    date_ DATE NOT NULL,
    id_car INTEGER,
    id_client INTEGER,
    id_agent INTEGER,
    FOREIGN KEY (id_car) REFERENCES car(id),
    FOREIGN KEY (id_client) REFERENCES customer(id),
    FOREIGN KEY (id_agent) REFERENCES agent(id),
    FOREIGN KEY (id_policy) REFERENCES policyMy(id)
);