export default {
    getSchema(){
        return (
            `CREATE TABLE  Category (
  _id         INTEGER   PRIMARY KEY  AUTOINCREMENT,
  name        TEXT      NOT NULL     UNIQUE,
  required    INTEGER   NOT NULL     DEFAULT 0,
  createdAt   TEXT      NOT NULL     DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Category (name,required) VALUES ('No category','0');

CREATE TABLE  Charge (
  _id         INTEGER   PRIMARY KEY  AUTOINCREMENT,
  name        TEXT      NOT NULL,
  money       REAL      NOT NULL     CHECK(money > 0),
  categoryId  INTEGER   NOT NULL     DEFAULT 1,
  required    INTEGER   NOT NULL     DEFAULT 0,
  createdAt   TEXT      NOT NULL     DEFAULT CURRENT_TIMESTAMP,
  createdDate DATE      NOT NULL     DEFAULT CURRENT_DATE,

  FOREIGN KEY(categoryId) REFERENCES Category(_id) ON DELETE SET DEFAULT
);

CREATE INDEX charge_name_index                 ON  Charge(name);
CREATE INDEX charge_categoryId_index           ON  Charge(categoryId);
CREATE INDEX charge_created_date_index         ON  Charge(createdAt);
CREATE INDEX charge_created_date_short_index   ON  Charge(createdDate);

CREATE TABLE  Income (
  _id         INTEGER    PRIMARY KEY  AUTOINCREMENT,
  name        TEXT       NOT NULL,
  money       REAL       NOT NULL     CHECK(money > 0),
  createdAt   TEXT       NOT NULL     DEFAULT CURRENT_TIMESTAMP,
  createdDate DATE       NOT NULL     DEFAULT CURRENT_DATE
);

CREATE INDEX income_created_date_short_index ON Income(createdDate);`
        );
    }
}