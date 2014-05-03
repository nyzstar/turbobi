# --- First database schema

# --- !Ups

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

SET REFERENTIAL_INTEGRITY TRUE;
