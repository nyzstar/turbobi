# --- First database schema

# --- !Ups


# ------- Turbo BI tables

create table USER (
	USER_ID			INT NOT NULL AUTO_INCREMENT,
	USER_NAME		VARCHAR(255) NOT NULL,
	USER_EMAIL		VARCHAR(255) NOT NULL,
	USER_PASSWORD	CHAR(60),
	CREATED_DATE	TIMESTAMP,
	MODIFIED_DATE	TIMESTAMP,
	CONSTRAINT PK_USER PRIMARY KEY (USER_ID)
);

create table PROJECT(
	PROJECT_ID		INT NOT NULL AUTO_INCREMENT,
	PROJECT_NAME	VARCHAR(255) NOT NULL,
	USER_ID			INT,
	CONSTRAINT PK_PROJECT PRIMARY KEY (PROJECT_ID)
);

create table SHEET(
	SHEET_ID		INT NOT NULL AUTO_INCREMENT,
	SHEET_NAME		VARCHAR(255),
	DATASOURCE_ID	INT,
	CONSTRAINT PK_SHEET PRIMARY KEY (SHEET_ID)
);

create table DATASOURCE(
	DATASOURCE_ID	INT NOT NULL AUTO_INCREMENT,
	DATASOURCE_NAME	VARCHAR(255),
	DATASOURCE_TYPE	VARCHAR(20),
	DATASOURCE_SPEC VARCHAR(1023),
	CONSTRAINT PK_DATASOURCE PRIMARY KEY (DATASOURCE_ID)
);

# --------Computer tables

create table test (name varchar(20), id int);

create table company (
  id                        int not null auto_increment,
  name                      varchar(255) not null,
  constraint pk_company primary key (id))
;

create table computer (
  id                        int not null auto_increment,
  name                      varchar(255) not null,
  introduced                timestamp,
  discontinued              timestamp,
  company_id                bigint,
  constraint pk_computer primary key (id))
;

alter table computer add constraint fk_computer_company_1 foreign key (company_id) references company (id) on delete restrict on update restrict;
create index ix_computer_company_1 on computer (company_id);

# --- !Downs

drop table if exists test;

SET REFERENTIAL_INTEGRITY FALSE;

drop table if exists company;

drop table if exists computer;

drop table if exists USER;

drop table if exists PROJECT;

drop table if exists SHEET;

drop table if exists DATASOURCE;

SET REFERENTIAL_INTEGRITY TRUE;
