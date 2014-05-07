# --- Sample dataset

# --- !Ups
insert into test (name, id) values ("test", 1);
insert into company (name) values ('Apple Inc.');
insert into company (name) values ('Thinking Machines');

insert into computer (name,introduced,discontinued,company_id) values ('MacBook Pro 15.4 inch',null,null,1);
insert into computer (name,introduced,discontinued,company_id) values ('CM-2a',null,null,2);
insert into computer (name,introduced,discontinued,company_id) values ('MacBook Pro','2006-01-10',null,1);


# --- !Downs
delete from test;
delete from company;
delete from computer;